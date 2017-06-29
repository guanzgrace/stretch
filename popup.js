document.getElementById("enable").onclick = function(){
	if(document.getElementById("enable").firstChild.data == "Enable") {
		chrome.storage.local.set({'enabled': true}, function() {
	      console.log("Enabled set to true.");
	    });
		document.getElementById("enable").firstChild.data = "Disable";
	}
	else { // currently says disable
		chrome.storage.local.set({'enabled': false}, function() {
	      console.log("Enabled set to false.");
	    });
		document.getElementById("enable").firstChild.data = "Enable";
	}
};