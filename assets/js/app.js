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
        name: trainName,
        destination: trainDestination,
        start: trainStart,
        frequency: trainFrequency
    }).getKey();

    console.log(trainID)

});

function createRow(data) {
    
    var dataRow = $("<tr>").attr('id', data.key).attr('data-value', data.key)
    var nameData = $("<td>").text(data.name)
    var destinationData = $("<td>").text(data.destination)
    var frequency = $("<td>").text(data.frequency + ' min')
    var nextTrain = $("<td>").text(data.start) // must calculate from start
    var minutesAway = $("<td>").text(data.start) // must calculate from start
    dataRow.append(nameData).append(destinationData).append(frequency).append(nextTrain).append(minutesAway)
    $('#table-body').append(dataRow)
}

database.ref().on("value", function(snapshot) {

  allTrains = snapshot.val()

  for (key in allTrains) {
      data = allTrains[key]
      data.key = key
      createRow(data)
  }
//   console.log(snapshot.val().name);
//   console.log(snapshot.val().email);
//   console.log(snapshot.val().age);
//   console.log(snapshot.val().comment);

  // Change the HTML to reflect

//   $("#name-display").text(snapshot.val().name);
//   $("#email-display").text(snapshot.val().email);
//   $("#age-display").text(snapshot.val().age);
//   $("#comment-display").text(snapshot.val().comment);

  // Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});


