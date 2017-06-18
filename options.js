// update savings for frequency, start hour/min/ampm, end hour/min/ampm
document.getElementById("update").onclick = function() {
	update();
}

function update() {
	var frequency = document.getElementById("frequency");
	var freqVal = frequency.options[frequency.selectedIndex].value;

    var startHour = document.getElementById("startHour");
    var startHourVal = startHour.options[startHour.selectedIndex].value;
    var startMin = document.getElementById("startMin");
    var startMinVal = startMin.options[startMin.selectedIndex].value;
    var startHalf = document.getElementById("startHalf");
    var startHalfVal = startHalf.options[startHalf.selectedIndex].value;

    var endHour = document.getElementById("endHour");
    var endHourVal = endHour.options[endHour.selectedIndex].value;
    var endMin = document.getElementById("endMin");
    var endMinVal = endMin.options[endMin.selectedIndex].value;
    var endHalf = document.getElementById("endHalf");
    var endHalfVal = endHalf.options[endHalf.selectedIndex].value;

    if (endHourVal + endHalfVal > startHourVal + startHalfVal) {
    	alert("End time cannot be before start time.");
    	return;
    }

	chrome.storage.local.set({'freq': freqVal}, function() {
      console.log("Saved frequency: " + freqVal);
    });
    chrome.storage.local.set({'shv': startHourVal}, function() {
      console.log("Saved shv: " + startHourVal);
    });
    chrome.storage.local.set({'smv': startMinVal}, function() {
      console.log("Saved smv: " + startMinVal);
    });
    chrome.storage.local.set({'shav': startHalfVal}, function() {
      console.log("Saved shav: " + startHalfVal);
    });
    chrome.storage.local.set({'ehv': endHourVal}, function() {
      console.log("Saved ehv: " + endHourVal);
    });
    chrome.storage.local.set({'emv': endMinVal}, function() {
      console.log("Saved emv: " + endMinVal);
    });
    chrome.storage.local.set({'ehav': endHalfVal}, function() {
      console.log("Saved ehav: " + endHalfVal);
    });

    alert("Options saved.");
}

update(); // set the default options