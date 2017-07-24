// upon launching, create the alarm
recreateAlarm();

// opens the notifications tab every 30m/1h/2h
// creates the alarm with the given parameters: frequency, start hour value, start 
// minute value, start half value, end hour value, end minute value, end half value
// type to parseInt so that 2 + 3 =/= 23
function createAlarm(freq) {
    var now = new Date();
    var day = now.getDate();

    // '+' casts the date to a number, like [object Date].getTime();
    // YYYY               MM              DD     HH       MM  SS MS
    var timestamp = +new Date(now.getFullYear(), now.getMonth(), day, 1, 0, 0, 0);

    chrome.alarms.clearAll();
    // Create the alarm, named alarmStart
    chrome.alarms.create('alarmStart', {
        when: timestamp,
        periodInMinutes: freq // for debugging, open the notifications every 1 min
        //periodInMinutes: freq
    });
}

// opens the notification in a new browser tab.
function openNotification() {
    console.log("opening notification");
    chrome.tabs.create({ url: 'notification.html', active: true });
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
    console.log("storage changed");
    var anythingImportantChanged = false;
    var changedItems = Object.keys(changes);
 
    for (var item of changedItems) {
        if (item == 'freq') { anythingImportantChanged = true; }
        console.log(item + " has changed:");
        console.log("Old value: " + changes[item].oldValue);
        console.log("New value: " + changes[item].newValue);
    }

    if (anythingImportantChanged) { recreateAlarm(); }
});

// recreates the alarm either by default or by storage, if they exist
function recreateAlarm() {
    console.log("running recreateAlarm");
    var freq = 30; // default = 9-5, 30 min apart

    // query old options, null should be accounted for but just in case...
    chrome.storage.local.get('freq', function(options) {
        if(options.freq != null) freq = parseInt(options.freq);
    });
    createAlarm(freq);
}
