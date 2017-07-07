chrome.storage.local.get('enabled', function(option) {
    if (option.enabled != null) {
		if (! option.enabled) {
			document.getElementById("enable").firstChild.data = "Enable";
		} else { // is disabled
			document.getElementById("enable").firstChild.data = "Disable";
		}  	
    } else { // first initialization
    	document.getElementById("enable").firstChild.data = "Disable";
    }
});

document.getElementById("enable").onclick = function(){
	if(document.getElementById("enable").firstChild.data == "Enable") {
		chrome.storage.local.set({'enabled': true}, function() {
	      console.log("Enabled set to true.");
	    });
		document.getElementById("enable").firstChild.data = "Disable";
	} else { // currently says disable
		chrome.storage.local.set({'enabled': false}, function() {
	      console.log("Enabled set to false.");
	    });
		document.getElementById("enable").firstChild.data = "Enable";
	}
};