// START CODING BELOW!!
$(document).ready(function () {
    $('.timepicker').timepicker({ twelveHour: false })
})
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDZ8CCo4GE2Dd4NaHAiAxwZsOQeb7w9J2M",
    authDomain: "class-20-6319b.firebaseapp.com",
    databaseURL: "https://class-20-6319b.firebaseio.com",
    storageBucket: "class-20-6319b.appspot.com",
    messagingSenderId: "283260951413"
}

firebase.initializeApp(config)

// Create a variable to reference the database
var database = firebase.database()

// database.ref().set({
//     trainName: "hector",
//     trainDestination: "lalala",
//     trainStart: "jajajaja",
//     trainFrequency: "3232323"
//   });

// Initial Values
var trainName = ""
var trainDestination = ""
var trainStart = ""
var trainFrequency = ""

// Capture Button Click
$("#train-new-submit").on("click", function (event) {
    // Don't refresh the page!
    console.log("You clicked")
    event.preventDefault()

    // YOUR TASK!!!
    // Code in the logic for storing and retrieving the most recent user.
    // Don't forget to provide initial data to your Firebase database.
    trainName = $("#train_name").val().trim()
    trainDestination = $("#train_destination").val().trim()
    trainStart = $("#train_start").val().trim()
    trainFrequency = $("#train_frequency").val().trim()


    console.log(trainFrequency)

    database.ref().set({
        trainName: trainName,
        trainDestination: trainDestination,
        trainStart: trainStart,
        trainFrequency: trainFrequency
    });


});

// Firebase watcher + initial loader HINT: .on("value")
// database.ref().on("value", function(snapshot) {

//   // Log everything that's coming out of snapshot
//   console.log(snapshot.val());
//   console.log(snapshot.val().name);
//   console.log(snapshot.val().email);
//   console.log(snapshot.val().age);
//   console.log(snapshot.val().comment);

//   // Change the HTML to reflect
//   $("#name-display").text(snapshot.val().name);
//   $("#email-display").text(snapshot.val().email);
//   $("#age-display").text(snapshot.val().age);
//   $("#comment-display").text(snapshot.val().comment);

//   // Handle the errors
// }, function(errorObject) {
//   console.log("Errors handled: " + errorObject.code);
// });