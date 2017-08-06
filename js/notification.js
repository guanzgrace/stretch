// Queries for the noficiation html page.

// check how long ago the exercises were saved, if they were saved more than
// 1 month ago then re-get them and store them locally.
chrome.storage.local.get('exercisesLastSaved', function(date) {
    if (date.exercisesLastSaved == null) { 
        queryAllAPIs(grabAndDisplayExercise); 
    }
    else {
        var currentDate = new Date();
        var currentDate_ms = currentDate.getTime();
        if ((currentDate_ms - date.exercisesLastSaved) > (30 * 1000 * 60 * 60 * 24)) { 
            queryAllAPIs(grabAndDisplayExercise); 
        } else {
            grabAndDisplayExercise();
        }
    }
});

function queryAllAPIs(callback) {
    queryAPI(2056805, "elbowwrist", callback);
    queryAPI(2056807, "lowerbackcore", callback);
    queryAPI(2056810, "knee", callback);
}

// if the exercise is too old, re-get from website and save to storage.
function queryAPI(workoutID, workoutType, callback){ 
    var exercises;
    var xhr = new XMLHttpRequest();
    var URL = "https://physera.com/api/workout/" + workoutID;
    xhr.open("GET", URL, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            exercises = JSON.parse(xhr.responseText); // get the exercises
            
            var d = new Date(); // save the date we got this exercise
            chrome.storage.local.set({'exercisesLastSaved': d.getTime()}, function() {
                console.log("Current date " + d.getTime() + " saved as exercisesLastSaved.");
            });

            // save the results
            // we can't do this modularly since set({key: result}) results in an error
            if (workoutType == "elbowwrist") {
                chrome.storage.local.set({"elbowwristresults": exercises}, function() {
                  console.log("Saved " + workoutType + " results.");
                });
            } else if (workoutType == "lowerbackcore") {
                chrome.storage.local.set({"lowerbackcoreresults": exercises}, function() {
                  console.log("Saved " + workoutType + " results.");
                });
            } else if (workoutType == "knee") {
                chrome.storage.local.set({"kneeresults": exercises}, function() {
                  console.log("Saved " + workoutType + " results.");
                  callback();
                });
            }
            
        } // end if readystate = 4 statement
    } // end xhr on ready state change function
    xhr.send();  
} 

function grabAndDisplayExercise() {
    var results;
    chrome.storage.local.get('type', function(data) {
        var type;
        if (data.type == null) { type = "elbowwrist"; }
        else { type = data.type; }
        if (type == "elbowwrist") {
            chrome.storage.local.get("elbowwristresults", function(data) {
                pickRandomExercise(data.elbowwristresults.exercises);
            });
        } else if (type == "lowerbackcore") {
            chrome.storage.local.get("lowerbackcoreresults", function(data) {
                pickRandomExercise(data.lowerbackcoreresults.exercises);
            });
        } else if (type == "knee") {
            chrome.storage.local.get("kneeresults", function(data) {
                pickRandomExercise(data.kneeresults.exercises);
            });
        }
    });
}

// picks a random exercise, displays if it's valid
function pickRandomExercise(exercises){
    var exerciseKeys = Object.keys(exercises);
    var randomKey = exerciseKeys[Math.floor(Math.random() * exerciseKeys.length)];
    var selectedExercise = exercises[randomKey].exercise;
    var valid = ! selectedExercise.display_name.includes("DELETE");
    if (valid) { displayExercise(selectedExercise); }
    else { pickRandomExercise(exercises); }
}

// javascript to append to the html page to display an exercise, precondition it is valid
function displayExercise(selectedExercise) {
    var displayName = document.createElement('h2');
    displayName.innerHTML = selectedExercise.display_name;
    document.getElementById('content').append(displayName);

    var rc = selectedExercise.data.rep_count;
    var rt = selectedExercise.data.rep_time;
    if (rc != null & rt != null) {
        var repetitions = document.createElement('p');
        var repString = rc;
        if (rc > 1) { repString += " repetitions, one every " + rt + " seconds."; }
        else if (rc = 1) { repString += " repetition for " + rt + " seconds."; }
        repetitions.innerHTML = repString;
        document.getElementById('content').append(repetitions);
    }

    var br = document.createElement('br');
    document.getElementById('content').appendChild(br);
    
    var inst = selectedExercise.data.instructions;
    var instructions = document.createElement('p');
    instructions.className = "limitWidth";
    instructions.innerHTML = "Instructions: \n";
    document.getElementById('content').append(instructions);
    for (i in inst) {
        var instruction = document.createElement('p');
        var index = Number(i) + 1;
        instruction.innerHTML = index + '. ' + inst[i].text;
        document.getElementById('content').append(instruction);
    }

    var imageURL = selectedExercise.images[0].urls.original;
    var image = document.createElement('img');
    image.src = imageURL;
    image.setAttribute("class", "img-responsive");
    image.setAttribute("max-width", "100%");
    image.setAttribute("height", "auto");
    document.getElementById('image').append(image);
}