// opens the notifications tab every 1 h.
var timerID = setInterval(function() {
    chrome.tabs.create({ url: 'notification.html', "active": true });
	}, 3600000); 