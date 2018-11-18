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

    dataPush = {
        name: trainName,
        destination: trainDestination,
        start: trainStart,
        frequency: trainFrequency
    }

    database.ref().push(dataPush)

    $("#train_name").val('')
    $("#train_destination").val('')
    $("#train_start").val('')
    $("#train_frequency").val('')

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
  $('#table-body').empty()
  for (key in allTrains) {
      data = allTrains[key]
      data.key = key
      createRow(data)
  }

  // Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

function calculateNext(data) {
    var freq = data.frequency

    var start = moment(data.start, 'HH:mm').subtract(1, "years")
    var now = moment()
    var delta = now.diff( moment(start), "minutes");
    var remainder = delta % freq
    var delta2 = freq - remainder
    var upcoming = now.add(delta2, 'minutes').format('h:mm a')
    console.log("upcoming minutes ::: " + delta2)
    console.log("upcoming time ::: " + upcoming)
}

