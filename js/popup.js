chrome.storage.local.get(['enabled', 'freq', 'type'], function(option) {
	console.log("Grabbing enabled and frequency from storage.");

	// enabled
    if (option.enabled != null) {
		if (! option.enabled) {
			document.getElementById("enable").firstChild.data = "Disabled";
		} else { // is disabled
			document.getElementById("enable").firstChild.data = "Enabled";
		}  	
    } else { // first initialization
    	document.getElementById("enable").firstChild.data = "Disabled";
    }

    // frequency
    if (option.freq != null) {
		if (parseInt(option.freq) == 30) {
			document.getElementById("frequency").firstChild.data = "Every 30 Minutes";
		} else if (parseInt(option.freq) == 60) { // freq is every 1 hour
			document.getElementById("frequency").firstChild.data = "Every 1 Hour";
		} else { // freq should be every 2 hours
			document.getElementById("frequency").firstChild.data = "Every 2 Hours";
		}
    } else { // first initialization
    	document.getElementById("frequency").firstChild.data = "Every 30 Minutes";
    }

    // type 
    if (option.type != null) {
		if (option.type == "elbowwrist") {
			document.getElementById("type").firstChild.data = "Elbow & Wrist";
		} else if (option.type == "lowerbackcore") { 
			document.getElementById("type").firstChild.data = "Lower Back & Core";
		} else if (option.type == "knee") { 
			document.getElementById("type").firstChild.data = "Knee";
		} 	
    } else { // first initialization
    	document.getElementById("type").firstChild.data = "Elbow & Wrist";
    }
});

document.getElementById("enable").onclick = function(){
	if(document.getElementById("enable").firstChild.data == "Disabled") {
		chrome.storage.local.set({'enabled': true}, function() {
	      console.log("Enabled set to true.");
	    });
		document.getElementById("enable").firstChild.data = "Enabled";
	} else { // currently says disable
		chrome.storage.local.set({'enabled': false}, function() {
	      console.log("Enabled set to false.");
	    });
		document.getElementById("enable").firstChild.data = "Disabled";
	}
};

document.getElementById("frequency").onclick = function(){
	// currently is 2 hours, set to be every 30 min
	if(document.getElementById("frequency").firstChild.data == "Every 2 Hours") {
		chrome.storage.local.set({'freq': 30}, function() {
	      console.log("Set frequency to every 30 minutes.");
	    });
		document.getElementById("frequency").firstChild.data = "Every 30 Minutes";
	} // currently says 30 min, set to be every hour
	else if(document.getElementById("frequency").firstChild.data == "Every 30 Minutes")  { 
		chrome.storage.local.set({'freq': 60}, function() {
	      console.log("Set frequency to every 60 minutes.");
	    });
		document.getElementById("frequency").firstChild.data = "Every 1 Hour";
	} else { // currently says 1 hour, set to every 2 hours
		chrome.storage.local.set({'freq': 120}, function() {
	      console.log("Set frequency to every 120 minutes.");
	    });
		document.getElementById("frequency").firstChild.data = "Every 2 Hours";
	}
};

document.getElementById("type").onclick = function(){
	// lower back core
	if(document.getElementById("type").firstChild.data == "Elbow & Wrist") {
		chrome.storage.local.set({'type': "lowerbackcore"}, function() {
	      console.log("Set type to lowerbackcore.");
	    });
		document.getElementById("type").firstChild.data = "Lower Back & Core";
	} // knee
	else if(document.getElementById("type").firstChild.data == "Lower Back & Core")  { 
		chrome.storage.local.set({'type': "knee"}, function() {
	      console.log("Set type to knee.");
	    });
		document.getElementById("type").firstChild.data = "Knee";
	} else { // elbow wrist
		chrome.storage.local.set({'type': "elbowwrist"}, function() {
	      console.log("Set type to elbowwrist.");
	    });
		document.getElementById("type").firstChild.data = "Elbow & Wrist";
	}
};

document.getElementById("notification").onclick = function(){
    console.log("Calling openNotification in background.js.");
    var popupUrl = chrome.runtime.getURL('/notification.html');
    chrome.tabs.query({url:popupUrl}, function(tabs){
        if(tabs.length > 0){
            console.log("Tab exists");
            console.log(tabs);
            chrome.tabs.remove(tabs[0].id);
        }
        chrome.windows.create({ url: 'notification.html', type: "popup" });
    });
};