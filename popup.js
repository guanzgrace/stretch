chrome.storage.local.get(['enabled', 'freq'], function(option) {
    if (option.enabled != null) {
		if (! option.enabled) {
			document.getElementById("enable").firstChild.data = "Currently disabled. Click to Enable.";
		} else { // is disabled
			document.getElementById("enable").firstChild.data = "Currently enabled. Click to Disable.";
		}  	
    } else { // first initialization
    	document.getElementById("enable").firstChild.data = "Currently disabled. Click to Enable.";
    }
    if (option.freq != null) {
		if (parseInt(option.freq) == 30) {
			document.getElementById("frequency").firstChild.data = "Current Frequency: Every 30 Minutes";
		} else if (parseInt(option.freq) == 60) { // freq is every 1 hour
			document.getElementById("frequency").firstChild.data = "Current Frequency: Every 1 Hour";
		} else {
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
	} else { // currently says 30 min, set to be every hour
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