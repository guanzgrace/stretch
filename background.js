// upon launching, create the alarm
recreateAlarm();

// opens the notifications tab every 30m/1h/2h at xx:30 and xx:00. xx is odd for every 2h.
function createAlarm(freq) {
    console.log("Calling createAlarm in background.js.")
    var now = new Date();
    var day = now.getDate();
    
    //                                     YYYY              MM  DD   HH MM SS MS
    var timestamp = +new Date(now.getFullYear(), now.getMonth(), day, 1, 0, 0, 0);

    // clear the past alarmStart; then, create the alarm, named alarmStart.
    chrome.alarms.clearAll();
    chrome.alarms.create('alarmStart', {
        when: timestamp,
        periodInMinutes: freq // for debugging, open the notifications every 1 min
        //periodInMinutes: 1
    });
}

// opens the notification in a new browser tab.
function openNotification() {
    console.log("Calling openNotification in background.js.");
    chrome.tabs.create({ url: 'notification.html', active: true });
}

// recreates the alarm either by default or by storage, if they exist
function recreateAlarm() {
    console.log("Calling recreateAlarm in background.js.");
    var freq = 30; // default 30 min apart
    // query old options, account for null
    chrome.storage.local.get('freq', function(options) {
        if(options.freq != null) freq = parseInt(options.freq);
    });
    createAlarm(freq);
}

// listen for time and open the notification if it meets correct conditions
chrome.alarms.onAlarm.addListener(function(alarm) {
    chrome.storage.local.get('enabled', function(option) {
        if (alarm.name === 'alarmStart' // make sure we're turning on the right alarm
            && ((option.enabled != null && option.enabled) // if enabled, make sure it's enabled
                || option.enabled == null))  { // or if we are initializing for the first time
            openNotification();
        }
    });   
});

// if storage is changed, recreate the alarm
chrome.storage.onChanged.addListener(function(changes, namespace) {
    var anythingImportantChanged = false;
    var changedItems = Object.keys(changes);
    for (var item of changedItems) {
        if (item == 'freq') { anythingImportantChanged = true; }
        console.log(item + " has changed in storage: " + 
            "Old value: " + changes[item].oldValue +
            "New value: " + changes[item].newValue);
    }
    if (anythingImportantChanged) { recreateAlarm(); }
});
