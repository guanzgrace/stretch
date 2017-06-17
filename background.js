// opens the notifications tab every 30m/1h/2h
// users should be able to set a start time hm

/*var keys = ['freq', 'shv', 'smv', 'shav', 'ehv', 'emv', 'ehav'];
var opts = [thirty, 9, 00, AM, 5, 00, PM]
chrome.storage.local.get(keys, function(options) {
    if (options.freq != null) opts[0] = options.freq;
    if (options.shv != null) opts[0] = options.shv;
    if (options.smv != null) opts[0] = options.smv;
    if (options.shav != null) opts[0] = options.shav;
    if (options.ehv != null) opts[0] = options.ehv;
    if (options.emv != null) opts[0] = options.emv;
    if (options.ehav != null) opts[0] = options.ehav;
});

console.log(opts);*/



function createAlarm() {
    var now = new Date();
    var day = now.getDate();
    if (now.getHours() >= 24) { // 9 AM already passed
        day += 1;
    }

    // '+' casts the date to a number, like [object Date].getTime();
    var timestamp = +new Date(now.getFullYear(), now.getMonth(), day, 21, 7, 0, 0);
    //                        YYYY               MM              DD  HH MM SS MS

    // Create
    chrome.alarms.create('alarmStart', {
        when: timestamp,
        periodInMinutes: 30
    });
}

function openNotification() {
    chrome.tabs.create({ url: 'notification.html', active: true });
}

// listen for time
chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === 'alarmStart') {
        openNotification();
    }
});
createAlarm();