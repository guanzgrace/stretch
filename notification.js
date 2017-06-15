var exercises;
var xhr = new XMLHttpRequest();
xhr.open("GET", "https://physera.com/api/exercise", true);
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    // innerText does not let the attacker inject HTML elements.
    exercises = JSON.parse(xhr.responseText);
    pickRandomExercise(exercises.results);
    //console.log(exercises);
  }
}
xhr.send();


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

function displayExercise(selectedExercise) {
    var htmlText = '';

    var displayName = document.createElement('h2');
    displayName.innerHTML = selectedExercise.display_name;
    document.getElementById('content').append(displayName);

    var desc = selectedExercise.data.description;
    var rc = selectedExercise.data.rep_count;
    var rt = selectedExercise.data.rep_time;

    if (desc.length != 0 && rc != null & rt != null) {
        var description = document.createElement('p');
        description.innerHTML = "Description: " + desc;
        document.getElementById('content').append(description);
        var repetitions = document.createElement('p');
        var repString = "Repetitions: " + rc;
        if (rc > 1) {
            repString += " repetition(s) every " + rt + " seconds.";
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
    image.width = 320;
    
    document.getElementById('content').append(image);
}