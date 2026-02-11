// Queries for the notification html page.
// Loads exercise data from local JSON files.

const UPPER_BODY_URL = chrome.runtime.getURL('exercises/2074597.json');
const LOWER_BODY_URL = chrome.runtime.getURL('exercises/2074598.json');

grabAndDisplayExercise();

async function grabAndDisplayExercise() {
    try {
        const { type: savedType } = await chrome.storage.local.get('type');
        const type = savedType || "upperbody";
        let url;
        if (type === "fullbody") {
            url = Math.round(Math.random()) === 0 ? UPPER_BODY_URL : LOWER_BODY_URL;
        } else if (type === "lowerbody") {
            url = LOWER_BODY_URL;
        } else {
            url = UPPER_BODY_URL;
        }
        const response = await fetch(url);
        const data = await response.json();
        pickRandomExercise(data.exercises);
    } catch {
        const msg = document.createElement('h2');
        msg.textContent = "Could not load exercises. Please try again.";
        document.getElementById('content').append(msg);
    }
}

// picks a random exercise, displays if it's valid
function pickRandomExercise(exercises){
    const valid = exercises.filter(
        e => !e.exercise.display_name.includes("DELETE")
    );
    if (valid.length === 0) {
        const msg = document.createElement('h2');
        msg.textContent = "No exercises available.";
        document.getElementById('content').append(msg);
        return;
    }
    const selected = valid[Math.floor(Math.random() * valid.length)];
    displayExercise(selected.exercise);
}

// javascript to append to the html page to display an exercise, precondition it is valid
function displayExercise(selectedExercise) {
    const displayName = document.createElement('h2');
    displayName.textContent = selectedExercise.display_name;
    document.getElementById('content').append(displayName);

    const rc = selectedExercise.reps;
    const rt = selectedExercise.rep_time;
    if (rc != null && rt != null) {
        const repetitions = document.createElement('p');
        const icon = document.createElement('span');
        icon.textContent = "\u23F0";
        repetitions.append(icon);
        let repText = " " + rc;
        if (rc > 1) { repText += " repetitions, one every " + rt + " seconds."; }
        else if (rc === 1) { repText += " repetition for " + rt + " seconds."; }
        repetitions.append(repText);
        document.getElementById('content').append(repetitions);
    }

    const br = document.createElement('br');
    document.getElementById('content').appendChild(br);

    const inst = selectedExercise.instructions;
    if (inst && inst.length > 0) {
        const instructions = document.createElement('h4');
        instructions.textContent = "Instructions:";
        document.getElementById('content').append(instructions);
        for (const [i, step] of inst.entries()) {
            const instruction = document.createElement('p');
            const index = i + 1;
            instruction.textContent = index + '. ' + step.text;
            document.getElementById('content').append(instruction);
        }
    }

    if (selectedExercise.images && selectedExercise.images.length > 0) {
        const imageURL = selectedExercise.images[0].urls.original;
        const image = document.createElement('img');
        image.src = imageURL;
        image.className = "img-responsive";
        image.alt = selectedExercise.display_name;
        document.getElementById('image').append(image);
    }
}
