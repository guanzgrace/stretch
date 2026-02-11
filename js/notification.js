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
    var valid = exercises.filter(
        e => !e.exercise.display_name.includes("DELETE")
    );
    if (valid.length === 0) {
        var msg = document.createElement('h2');
        msg.textContent = "No exercises available.";
        document.getElementById('content').append(msg);
        return;
    }
    var selected = valid[Math.floor(Math.random() * valid.length)];
    displayExercise(selected.exercise);
}

// javascript to append to the html page to display an exercise, precondition it is valid
function displayExercise(selectedExercise) {
    var displayName = document.createElement('h2');
    displayName.textContent = selectedExercise.display_name;
    document.getElementById('content').append(displayName);

    var rc = selectedExercise.reps;
    var rt = selectedExercise.rep_time;
    if (rc != null && rt != null) {
        var repetitions = document.createElement('p');
        var icon = document.createElement('i');
        icon.className = "fa fa-clock-o";
        icon.setAttribute("aria-hidden", "true");
        repetitions.append(icon);
        var repText = " " + rc;
        if (rc > 1) { repText += " repetitions, one every " + rt + " seconds."; }
        else if (rc == 1) { repText += " repetition for " + rt + " seconds."; }
        repetitions.append(repText);
        document.getElementById('content').append(repetitions);
    }

    var br = document.createElement('br');
    document.getElementById('content').appendChild(br);
    
    var inst = selectedExercise.instructions;
    var instructions = document.createElement('h4');
    instructions.className = "limitWidth";
    instructions.textContent = "Instructions:";
    document.getElementById('content').append(instructions);
    for (const [i, step] of inst.entries()) {
        var instruction = document.createElement('p');
        var index = i + 1;
        instruction.textContent = index + '. ' + step.text;
        document.getElementById('content').append(instruction);
    }

    var imageURL = selectedExercise.images[0].urls.original;
    var image = document.createElement('img');
    image.src = imageURL;
    image.className = "img-responsive";
    image.style.maxWidth = "100%";
    image.style.height = "auto";
    document.getElementById('image').append(image);
}