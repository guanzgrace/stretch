// opens the notifications tab every 30m/1h/2h
// users should be able to set a start time hm

function createAlarm(freq, shv, smv, shav, ehv, emv, ehav) {
   // var keys = ['freq', 'shv', 'smv', 'shav', 'ehv', 'emv', 'ehav'];
    //var opts = [thirty, 9, 00, AM, 5, 00, PM];

    var now = new Date();
    var day = now.getDate();
    if (now.getHours() >= ehv + ehav) { // 9 AM already passed
        day += 1;
    }

    // '+' casts the date to a number, like [object Date].getTime();
    var timestamp = +new Date(now.getFullYear(), now.getMonth(), day, shv + shav, smv, 0, 0);
    //                        YYYY               MM              DD  HH MM SS MS

    // Create
    chrome.alarms.create('alarmStart', {
        when: timestamp,
        periodInMinutes: freq
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

// default = 9-5, 30 min apart
var freq = 30;
var shv = 9;
var smv = 0;
var shav = 0;
var ehv = 5;
var emv = 0;
var ehav = 12;

// query old options, null should be accounted for but just in case...
chrome.storage.local.get(['freq', 'shv', 'smv', 'shav', 'ehv', 'emv', 'ehav']
                            , function(options) {
    if(options.freq != null) freq = options.freq;
    if(options.shv != null)  shv = options.shv;
    if(options.smv != null)  smv = options.smv;
    if(options.shav != null)  shav = options.shav;
    if(options.ehv != null)  ehv = options.ehv;
    if(options.emv != null)  emv = options.emv;
    if(options.ehav != null)  ehav = options.ehav;
});
createAlarm(freq, shv, smv, shav, ehv, emv, ehav);
