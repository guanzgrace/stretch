var exercises;
var xhr = new XMLHttpRequest();
xhr.open("GET", "https://physera.com/api/exercise", true);
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    // innerText does not let the attacker inject HTML elements.
    exercises = xhr.responseText;
    console.log(exercises);
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

    // add the name, description, reps
    htmlText += '<h2><b>' + selectedExercise.display_name + '</b></h2>';
    
    var desc = selectedExercise.data.description;
    var rc = selectedExercise.data.rep_count;
    var rt = selectedExercise.data.rep_time;

    if (desc.length != 0 && rc != null & rt != null) {
        htmlText += '<p> Description: ' + desc + '</p>';
        htmlText += '<p> Repetitions: ' + rc + 
        ' repetition(s) every ' + rt + ' seconds.</p>';
    }
    // find the instructions
    var instructions = selectedExercise.data.instructions;
    htmlText += '<p class="limitWidth"><b>Instructions:</b><br>';
    for (i in instructions) {
        var index = Number(i) + 1;
        htmlText += index + '. ' +instructions[i].text + '<br>';
    }
    htmlText += "</p><br>";

    // add the images
    var imageURL = selectedExercise.images[0].urls.original;
    
    htmlText += '<img src =\"' + imageURL + '\" width = \'320px\'; height = auto/>';
    
    document.getElementById('content').append(htmlText);
}