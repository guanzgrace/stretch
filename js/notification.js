// Queries for the noficiation html page.

// 5,242,880 bytes max. currently ~1 mil. hopefully will not need to configure 
// a new storage system. (clear storage every time a new dataset is queried?)
chrome.storage.local.getBytesInUse(null, function(bytes) {
    console.log(bytes); 
});

// check how long ago the exercises were saved, if they were saved more than
// 1 month ago then re-get them and store them locally.
chrome.storage.local.get('exercisesLastSaved', function(date) {
    if (date == null) { 
        queryAPI(); 
        grabAndDisplayExercise();
    }
    else { // date != null
        grabAndDisplayExercise();
    }
  var currentDate = new Date();
  var currentDate_ms = currentDate.getTime();
  if ((currentDate_ms - date) > (30 * 1000 * 60 * 60 * 24)) {
    queryAPI();
    grabAndDisplayExercise();
  }
});

function grabAndDisplayExercise() {
    var results;
    chrome.storage.local.get('results', function(data) {
        results = data.results;
        console.log(results);
        pickRandomExercise(results);
    });
}

// if the exercise is too old, re-get from website and save to storage.
function queryAPI(){ 
    var exercises;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://physera.com/api/exercise", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            // choose and display the exercise
            exercises = JSON.parse(xhr.responseText);
            pickRandomExercise(exercises.results);
            // save the date we got this exercise
            var d = new Date();
            chrome.storage.local.set({'exercisesLastSaved': d.getTime()}, function() {
                console.log("Current date " + d.getTime() + " saved as exercisesLastSaved.");
            });

            // save the results
            results = exercises.results;
            chrome.storage.local.set({'results': results}, function() {
              console.log("Saved results.");
              if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError.message);
                return;
              }
            });
            
            // save the number of exercises stored (currently not needed)
            chrome.storage.local.set({'numExercises': results.length}, function() {
                console.log("Num Exercises " + results.length + " saved as numExercises.");
            });
        } // end if readystate = 4 statement
    } // end xhr on ready state change function
    xhr.send();  
} 

// picks a random exercise, displays if it's valid
function pickRandomExercise(exercises){
    var exerciseKeys = Object.keys(exercises);
    var randomKey = exerciseKeys[Math.floor(Math.random() * exerciseKeys.length)];
    var selectedExercise = exercises[randomKey];
    
    var valid = ! selectedExercise.display_name.includes("DELETE");

    // CHECK IF THE EXERCISE IS VALID
    if (valid) {
        displayExercise(selectedExercise);
    } else { 
        pickRandomExercise(exercises);
    }
}

// javascript to append to the html page to display an exercise, precondition it is valid
function displayExercise(selectedExercise) {
    var htmlText = '';

    var displayName = document.createElement('h2');
    displayName.innerHTML = selectedExercise.display_name;
    document.getElementById('content').append(displayName);

    var rc = selectedExercise.data.rep_count;
    var rt = selectedExercise.data.rep_time;

    if (rc != null & rt != null) {
        var repetitions = document.createElement('p');
        var repString = "Repetitions: " + rc;
        if (rc > 1) {
            repString += " repetition(s), one every " + rt + " seconds.";
        }
        else if (rc = 1) {
            repString += " repetition for " + rt + " seconds.";
        }
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

    // add the images
    var imageURL = selectedExercise.images[0].urls.original;

    var image = document.createElement('img');
    image.src = imageURL;
    image.setAttribute("class", "img-responsive");
    image.setAttribute("max-width", "100%");
    image.setAttribute("height", "auto");
    
    document.getElementById('image').append(image);
}