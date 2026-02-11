// Stretch Reminder - Background Service Worker

// When the service worker starts (browser launch, wake from idle, extension install/update),
// ensure an alarm exists — but don't create a duplicate if one is already running.
(async () => {
    const existingAlarm = await chrome.alarms.get('alarmStart');
    if (!existingAlarm) {
        await recreateAlarm();
    }
})();

// Creates (or recreates) the stretch reminder alarm.
// Uses delayInMinutes so the first fire happens after one full interval,
// not immediately (which was the old bug — a past `when` timestamp fired instantly).
async function createAlarm(freq) {
    await chrome.alarms.clearAll();
    await chrome.alarms.create('alarmStart', {
        delayInMinutes: freq,
        periodInMinutes: freq
    });
}

// Opens the notification in a popup window, closing any previously opened one.
async function openNotification() {
    try {
        const { notificationTabId } = await chrome.storage.session.get('notificationTabId');
        if (notificationTabId) {
            // Silently ignore if tab was already closed by the user.
            await chrome.tabs.remove(notificationTabId).catch(() => {});
        }
        const win = await chrome.windows.create({
            url: 'notification.html',
            type: 'popup',
            width: 1150,
            height: 720,
            top: 20,
            left: 20
        });
        await chrome.storage.session.set({ notificationTabId: win.tabs[0].id });
    } catch (e) {
        console.error('Failed to open notification:', e);
    }
}

// Reads the saved frequency from storage and creates an alarm with it (default: 30 min).
async function recreateAlarm() {
    const { freq: savedFreq } = await chrome.storage.local.get('freq');
    const freq = savedFreq != null ? parseInt(savedFreq, 10) : 30;
    await createAlarm(freq);
}

// Listen for messages from popup (open notification, or recreate alarm on setting change).
chrome.runtime.onMessage.addListener(function(message) {
    if (message.action === 'openNotification') {
        openNotification().catch(e => console.error('Failed to open notification:', e));
    } else if (message.action === 'recreateAlarm') {
        recreateAlarm().catch(e => console.error('Failed to recreate alarm:', e));
    }
});

// When the alarm fires, open a notification if reminders are enabled.
chrome.alarms.onAlarm.addListener(async function(alarm) {
    if (alarm.name !== 'alarmStart') return;

    const { enabled } = await chrome.storage.local.get('enabled');
    if (enabled === false) {
        // User explicitly disabled — do nothing.
        return;
    }
    // enabled === true or null (first run) — show the notification.
    await openNotification();
    if (enabled == null) {
        await chrome.storage.local.set({ 'enabled': true });
    }
});