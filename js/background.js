// upon launching, create the alarm
recreateAlarm();

// opens the notifications tab every 30m/1h/2h at xx:30 and xx:00. xx is odd for every 2h.
// clears the past alarmStart and creates a new one.
function createAlarm(freq) {
    const now = new Date();
    const day = now.getDate();
    const timestamp = +new Date(now.getFullYear(), now.getMonth(), day, 1, 0, 0, 0);

    chrome.alarms.clearAll();
    chrome.alarms.create('alarmStart', {
        when: timestamp, periodInMinutes: freq
    });
}

// opens the notification in a new browser tab.
async function openNotification() {
    const { notificationTabId } = await chrome.storage.session.get('notificationTabId');
    if (notificationTabId) {
        await chrome.tabs.remove(notificationTabId).catch(() => {});
    }
    const win = await chrome.windows.create({ url: 'notification.html', type: "popup",
                                              width: 1150, height: 720, top: 20, left: 20 });
    await chrome.storage.session.set({ notificationTabId: win.tabs[0].id });
}

// recreates the alarm either by default or by storage, if they exist
function recreateAlarm() {
    chrome.storage.local.get('freq', function(options) {
        if (options.freq != null) { createAlarm(parseInt(options.freq)); }
        else { createAlarm(30); }
    });
}

// listen for messages from popup
chrome.runtime.onMessage.addListener(function(message) {
    if (message.action === 'openNotification') {
        openNotification();
    }
});

// listen for time and open the notification if it meets correct conditions
chrome.alarms.onAlarm.addListener(function(alarm) {
    chrome.storage.local.get('enabled', function(option) {
        if (option.enabled != null) {
            if (alarm.name === 'alarmStart' && option.enabled) {
                openNotification();
            }
        } else { // option.enabled == null, first initialization
            openNotification();
            chrome.storage.local.set({'enabled': true}, function() {
              console.log("Enabled set to true.");
            });
        }
    });
});