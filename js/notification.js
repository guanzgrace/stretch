// Queries for the notification html page.
// Loads exercise data from local JSON files.

const UPPER_BODY_URL = chrome.runtime.getURL('exercises/2074597.json');
const LOWER_BODY_URL = chrome.runtime.getURL('exercises/2074598.json');

grabAndDisplayExercise();

function grabAndDisplayExercise() {
    chrome.storage.local.get('type', function(data) {
        let type = data.type || "upperbody";
        let url;
        if (type == "fullbody") {
            url = Math.round(Math.random()) == 0 ? UPPER_BODY_URL : LOWER_BODY_URL;
        } else if (type == "lowerbody") {
            url = LOWER_BODY_URL;
        } else {
            url = UPPER_BODY_URL;
        }
        fetch(url)
            .then(response => response.json())
            .then(data => pickRandomExercise(data.exercises));
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

    var rc = selectedExercise.reps;
    var rt = selectedExercise.rep_time;
    if (rc != null && rt != null) {
        var repetitions = document.createElement('p');
        var repString = "<i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i> ";
        repString += rc;
        if (rc > 1) { repString += " repetitions, one every " + rt + " seconds."; }
        else if (rc == 1) { repString += " repetition for " + rt + " seconds."; }
        repetitions.innerHTML = repString;
        document.getElementById('content').append(repetitions);
    }

    var br = document.createElement('br');
    document.getElementById('content').appendChild(br);
    
    var inst = selectedExercise.instructions;
    var instructions = document.createElement('h4');
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