chrome.storage.local.get('enabled', function(option) {
	console.log("Grabbing enabled and frequency from storage.");

	// enabled
    if (option.enabled != null) {
		if (! option.enabled) {
			document.getElementById("enable").firstChild.data = "Currently disabled. Click to Enable.";
		} else { // is disabled
			document.getElementById("enable").firstChild.data = "Currently enabled. Click to Disable.";
		}  	
    } else { // first initialization
    	document.getElementById("enable").firstChild.data = "Currently disabled. Click to Enable.";
    }

    // frequency
    if (option.freq != null) {
		if (parseInt(option.freq) == 30) {
			document.getElementById("frequency").firstChild.data = "Current Frequency: Every 30 Minutes";
		} else if (parseInt(option.freq) == 60) { // freq is every 1 hour
			document.getElementById("frequency").firstChild.data = "Current Frequency: Every 1 Hour";
		} else { // freq should be every 2 hours
			document.getElementById("frequency").firstChild.data = "Current Frequency: Every 2 Hours";
		}
    } else { // first initialization
    	document.getElementById("frequency").firstChild.data = "Current Frequency: Every 30 Minutes";
    }
});

document.getElementById("enable").onclick = function(){
	if(document.getElementById("enable").firstChild.data == "Currently disabled. Click to Enable.") {
		chrome.storage.local.set({'enabled': true}, function() {
	      console.log("Enabled set to true.");
	    });
		document.getElementById("enable").firstChild.data = "Currently enabled. Click to Disable.";
	} else { // currently says disable
		chrome.storage.local.set({'enabled': false}, function() {
	      console.log("Enabled set to false.");
	    });
		document.getElementById("enable").firstChild.data = "Currently disabled. Click to Enable.";
	}
};

document.getElementById("frequency").onclick = function(){
	// currently is 2 hours, set to be every 30 min
	if(document.getElementById("frequency").firstChild.data == "Current Frequency: Every 2 Hours") {
		chrome.storage.local.set({'freq': 30}, function() {
	      console.log("Set frequency to every 30 minutes.");
	    });
		document.getElementById("frequency").firstChild.data = "Current Frequency: Every 30 Minutes";
	} // currently says 30 min, set to be every hour
	else if(document.getElementById("frequency").firstChild.data == "Current Frequency: Every 30 Minutes")  { 
		chrome.storage.local.set({'freq': 60}, function() {
	      console.log("Set frequency to every 60 minutes.");
	    });
		document.getElementById("frequency").firstChild.data = "Current Frequency: Every 1 Hour";
	} else { // currently says 1 hour, set to every 2 hours
		chrome.storage.local.set({'freq': 120}, function() {
	      console.log("Set frequency to every 120 minutes.");
	    });
		document.getElementById("frequency").firstChild.data = "Current Frequency: Every 2 Hours";
	}
};

document.getElementById("notification").onclick = function(){
    console.log("Calling openNotification in background.js.");
    var popupUrl = chrome.runtime.getURL('/notification.html');
    chrome.tabs.query({url:popupUrl}, function(tabs){
        if(tabs.length > 0){
            console.log("Tab exists");
            console.log(tabs);
            chrome.tabs.update(tabs[0].id, {url: tabs[0].url, active:true});
        } else {
            chrome.windows.create({ url: 'notification.html', type: "popup" });
        }
    });
};