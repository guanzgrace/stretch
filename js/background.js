// Stretch Reminder - Background Service Worker

// When the service worker starts (browser launch, wake from idle, extension install/update),
// ensure an alarm exists — but don't create a duplicate if one is already running.
chrome.alarms.get('alarmStart', (existingAlarm) => {
    if (!existingAlarm) {
        recreateAlarm();
    }
});

// Creates (or recreates) the stretch reminder alarm.
// Uses delayInMinutes so the first fire happens after one full interval,
// not immediately (which was the old bug — a past `when` timestamp fired instantly).
function createAlarm(freq) {
    chrome.alarms.clearAll(() => {
        chrome.alarms.create('alarmStart', {
            delayInMinutes: freq,
            periodInMinutes: freq
        });
    });
}

// Opens the notification in a popup window, closing any previously opened one.
async function openNotification() {
    try {
        const { notificationTabId } = await chrome.storage.session.get('notificationTabId');
        if (notificationTabId) {
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
function recreateAlarm() {
    chrome.storage.local.get('freq', function(options) {
        const freq = options.freq != null ? parseInt(options.freq) : 30;
        createAlarm(freq);
    });
}

// Listen for messages from popup (open notification, or recreate alarm on setting change).
chrome.runtime.onMessage.addListener(function(message) {
    if (message.action === 'openNotification') {
        openNotification();
    } else if (message.action === 'recreateAlarm') {
        recreateAlarm();
    }
});

// When the alarm fires, open a notification if reminders are enabled.
chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name !== 'alarmStart') return;

    chrome.storage.local.get('enabled', function(option) {
        if (option.enabled === false) {
            // User explicitly disabled — do nothing.
            return;
        }
        // enabled === true or null (first run) — show the notification.
        openNotification();
        if (option.enabled == null) {
            chrome.storage.local.set({ 'enabled': true });
        }
    });
});