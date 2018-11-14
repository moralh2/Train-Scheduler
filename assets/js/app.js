// START CODING BELOW!!
$(document).ready(function () {
    $('.timepicker').timepicker({ twelveHour: false })
})
// Initialize Firebase
var config = {
    apiKey: "AIzaSyA2iLO49qFM9eOFY47KJuuFaH-_Ajpd2b0",
    authDomain: "trains-b2a80.firebaseapp.com",
    databaseURL: "https://trains-b2a80.firebaseio.com",
    projectId: "trains-b2a80",
    storageBucket: "",
    messagingSenderId: "536473866489"
  };

firebase.initializeApp(config)

// Create a variable to reference the database
var database = firebase.database()

var trainName = ""
var trainDestination = ""
var trainStart = ""
var trainFrequency = ""

$("#train-new-submit").on("click", function (event) {
    event.preventDefault()

    trainName = $("#train_name").val().trim()
    trainDestination = $("#train_destination").val().trim()
    trainStart = $("#train_start").val().trim()
    trainFrequency = $("#train_frequency").val().trim()

    var trainID = database.ref().push({
        trainName: trainName,
        trainDestination: trainDestination,
        trainStart: trainStart,
        trainFrequency: trainFrequency
    }).getKey();

    console.log(trainID)

});

function createRow(data) {
    var dataRow = $("<tr>")
    var nameData = $("<td>").text(data.name)
    var destinationData = $("<td>").text(data.destination)
    var frequency = $("<td>").text(data.frequency)
    var nextTrain = $("<td>").text(data.next)
    var minutesAway = $("<td>").text(data.minutes)
    dataRow.append(nameData).append(destinationData).append(frequency).append(nextTrain).append(minutesAway)
    $('#table-body').append(dataRow)
}

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