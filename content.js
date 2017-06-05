// content.js
//alert("Hello from your Chrome extension!")
/*
var now = new Date();

var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 54, 0, 0) - now;
if (millisTill10 < 0) {
     millisTill10 += 86400000; // it's after 10am, try 10am tomorrow.
}
setTimeout(function(){alert("It's 10am!")}, millisTill10);
*/
var timerID = setInterval(function() {
    alert("Hello from your Chrome extension!")
}, 60 * 1000); 

$.getJSON('exercise.json').done(function(data){
        window.exercises = data;
        console.log(window.exercises);
        startGame();
    });

function pickRandomExercise(){
		var exercise_keys = Object.keys(window.exercises);
        var random_key = exercise_keys[Math.floor(Math.random() * exercise_keys.length)];
        window.selectedexercise = window.exercises[random_key];
        console.log(window.selectedexercise);
        console.log(window.exercises);
    }

pickRandomExercise();