// opens the notifications tab every 30m/1h/2h

// creates the alarm with the given parameters: frequency, start hour value, start 
// minute value, start half value, end hour value, end minute value, end half value
// type to parseInt so that 2 + 3 =/= 23
function createAlarm(freq, shv, smv, shav, ehv, emv, ehav) {
    var now = new Date();
    var day = now.getDate();
    // 9 AM already passed
    if (now.getHours() >= parseInt(ehv) + parseInt(ehav) { 
        day += 1;
    }

    // '+' casts the date to a number, like [object Date].getTime();
    var timestamp = +new Date(now.getFullYear(), now.getMonth(), parseInt(day), parseInt(shv) + parseInt(shav), parseInt(smv), 0, 0);
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
    var enabled = true;
    chrome.storage.local.get('enabled', function(option) {
        if (option != null) {
            enabled = option;
        }
    });
    
    if (alarm.name === 'alarmStart' && enabled) {
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
    if(options.freq != null) freq = parseInt(options.freq);
    if(options.shv != null)  shv = parseInt(options.shv);
    if(options.smv != null)  smv = parseInt(options.smv);
    if(options.shav != null)  shav = parseInt(options.shav);
    if(options.ehv != null)  ehv = parseInt(options.ehv);
    if(options.emv != null)  emv = parseInt(options.emv);
    if(options.ehav != null)  ehav = parseInt(options.ehav);
});
createAlarm(freq, shv, smv, shav, ehv, emv, ehav);
