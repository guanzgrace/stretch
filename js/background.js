// upon launching, create the alarm
recreateAlarm();

// opens the notifications tab every 30m/1h/2h at xx:30 and xx:00. xx is odd for every 2h.
// clears the past alarmStart and creates a new one.
function createAlarm(freq) {
    var now = new Date();
    var day = now.getDate();
    var timestamp = +new Date(now.getFullYear(), now.getMonth(), day, 1, 0, 0, 0);

    chrome.alarms.clearAll();
    chrome.alarms.create('alarmStart', {
        when: timestamp, periodInMinutes: freq
    });
}

// opens the notification in a new browser tab.
function openNotification() {
    var popupUrl = chrome.runtime.getURL('/notification.html');
    chrome.tabs.query({url:popupUrl}, function(tabs){
        if(tabs.length > 0){ chrome.tabs.remove(tabs[0].id); }
        chrome.windows.create({ url: 'notification.html', type: "popup",
                             width: 1150, height: 720, top: 20, left: 20 });
    });
}

// recreates the alarm either by default or by storage, if they exist
function recreateAlarm() {
    // account for null
    chrome.storage.local.get('freq', function(options) {
        if(options.freq != null) { createAlarm(parseInt(options.freq)); } 
        else { createAlarm(30); }
    });
}

// listen for time and open the notification if it meets correct conditions
chrome.alarms.onAlarm.addListener(function(alarm) {
    chrome.storage.local.get('enabled', function(option) {
        if (option.enabled != null) {
            if (alarm.name === 'alarmStart' // make sure we're turning on the right alarm
                && ((option.enabled != null && option.enabled) // if enabled, make sure it's enabled
                    || option.enabled == null))  { // or if we are initializing for the first time
                openNotification();
            }
        } else { // option.enabled == null
            openNotification();
            chrome.storage.local.set({'enabled': true}, function() {
              console.log("Enabled set to true.");
            });
        }
    });   
});