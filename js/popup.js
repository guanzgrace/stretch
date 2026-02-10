// popup javascript
chrome.storage.local.get(['enabled', 'freq', 'type'], function(option) {
    if (option.enabled != null) { // enabled or disabled; for first initialization, enable
		if (! option.enabled) { document.getElementById("checkbox1").checked = false; } 
		else { document.getElementById("checkbox1").checked = true; }  	
    } 
    else {  document.getElementById("checkbox1").checked = true; }

    if (option.freq != null) { // what's the frequency? 30, 60, or 120
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

    if (option.type != null) { // type: currently supported elbow/wrist, lowerback/core, knee
		if (option.type == "upperbody") {
			document.getElementById("type").firstChild.data = "Upper Body";
		} else if (option.type == "lowerbody") { 
			document.getElementById("type").firstChild.data = "Lower Body";
		} else if (option.type == "fullbody") { 
			document.getElementById("type").firstChild.data = "Full Body";
		} 
    } else { // first initialization
    	document.getElementById("type").firstChild.data = "Upper Body";
    }
});

document.getElementById("checkbox1").addEventListener('click', function(){
	if(document.getElementById("checkbox1").checked == false) {
		chrome.storage.local.set({'enabled': false}, function() {
	      console.log("Enabled set to false.");
	    });
	} else {
		chrome.storage.local.set({'enabled': true}, function() {
	      console.log("Enabled set to true.");
	    });
	}
});

document.getElementById("frequency").addEventListener('click', function(){
	// currently is 2 hours, set to be every 30 min
	if(document.getElementById("frequency").firstChild.data == "Every 2 Hours") {
		chrome.storage.local.set({'freq': 30}, function() {
	      console.log("Set frequency to every 30 minutes.");
	      chrome.runtime.sendMessage({ action: 'recreateAlarm' });
	    });
		document.getElementById("frequency").firstChild.data = "Every 30 Minutes";
	} // currently says 30 min, set to be every hour
	else if(document.getElementById("frequency").firstChild.data == "Every 30 Minutes")  {
		chrome.storage.local.set({'freq': 60}, function() {
	      console.log("Set frequency to every 60 minutes.");
	      chrome.runtime.sendMessage({ action: 'recreateAlarm' });
	    });
		document.getElementById("frequency").firstChild.data = "Every 1 Hour";
	} else { // currently says 1 hour, set to every 2 hours
		chrome.storage.local.set({'freq': 120}, function() {
	      console.log("Set frequency to every 120 minutes.");
	      chrome.runtime.sendMessage({ action: 'recreateAlarm' });
	    });
		document.getElementById("frequency").firstChild.data = "Every 2 Hours";
	}
});

document.getElementById("type").addEventListener('click', function(){
	// currently upper body, set to lower body
	if(document.getElementById("type").firstChild.data == "Upper Body") {
		chrome.storage.local.set({'type': "lowerbody"}, function() {
	      console.log("Set type to lowerbody.");
	    });
		document.getElementById("type").firstChild.data = "Lower Body";
	} else if (document.getElementById("type").firstChild.data == "Lower Body") { // currently lower body, set to full body
		chrome.storage.local.set({'type': "fullbody"}, function() {
	      console.log("Set type to fullbody.");
	    });
		document.getElementById("type").firstChild.data = "Full Body";
	} else if (document.getElementById("type").firstChild.data == "Full Body") { // currently full body, set to upper body
		chrome.storage.local.set({'type': "upperbody"}, function() {
	      console.log("Set type to upperbody.");
	    });
		document.getElementById("type").firstChild.data = "Upper Body";
	}
});

document.getElementById("notification").addEventListener('click', function(){
    chrome.runtime.sendMessage({ action: 'openNotification' });
    window.close();
});