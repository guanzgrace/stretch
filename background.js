// opens the notifications tab every 30m/1h/2h
// users should be able to set a start time hm
var url = 'notification.html';

function createAlarm() {
    var now = new Date();
    var day = now.getDate();
    if (now.getHours() >= 9) { // 9 AM already passed
        day += 1;
    }
    
    // '+' casts the date to a number, like [object Date].getTime();
    var timestamp = +new Date(now.getFullYear(), now.getMonth(), day, 9, 0, 0, 0);
    //                        YYYY               MM              DD  HH MM SS MS

    // Create
    chrome.alarms.create('alarmStart', {
        when: timestamp,
        periodInMinutes: 30
    });
}

function openNotification() {
    chrome.tabs.query({
        url: url
    }, function(tabs) {
        if (tabs.length === 0) {
            chrome.tabs.create({ url: url, active: true });
        } else { // Focus first match, refresh the same page if it is already open
            chrome.tabs.update(tabs[0].id, { active: true });
        }
    });
}

// listen for time
chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === 'alarmStart') {
        openNotification();
    }
});
createAlarm();