$(document).ready(function () {
    $('.timepicker').timepicker({ twelveHour: false })
    makeTable()
    runTimer()
    $('.modal').modal({onCloseEnd: printMe("22222")})
})

function printMe(stringMe) {
    console.log(stringMe)
}

var intervalId;                                 // id for setInterval timer

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

$("#train-new-submit").on("click", function (event) {
    event.preventDefault()

    trainName = $("#train_name").val().trim()
    trainDestination = $("#train_destination").val().trim()
    trainStart = $("#train_start").val().trim()
    trainFrequency = $("#train_frequency").val().trim()

    if (trainName && trainDestination && trainStart && trainFrequency) {
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
        $("#errors").html('')
    }
    else {
        str = '<div class="col s12"><p class="red-text">Please fill out all fields</p></div>'
        $("#errors").html(str)

    }
});

function createRow(data) {
    var dataRow = $("<tr>").attr('id', data.key).attr('data-key', data.key).attr('data-start', data.start).attr('data-frequency', data.frequency)
    var nameData = $("<td>").text(data.name)
    var destinationData = $("<td>").text(data.destination)
    var frequency = $("<td>").text(data.frequency + ' min')
    var minutesAwayValue
    var nextTrainValue
    [minutesAwayValue, nextTrainValue] = calculateNext(data)
    var nextTrain = $("<td>").addClass("next-train").text(nextTrainValue)
    var minutesAway = $("<td>").addClass("min-away").text(minutesAwayValue)
    var startTime = $("<td>").text(data.start)

    dataRow.append(nameData).append(destinationData).append(frequency).append(nextTrain).append(minutesAway).append(startTime)
    $('#table-body').append(dataRow)
}

function makeTable() {
    $('#current-time').text(moment().format("MM/DD/YYYY h:mm a"))
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
}

function remakeTable() {
    $('#current-time').text(moment().format("MM/DD/YYYY h:mm:ss a"))
    allRows = $('#table-body').children('tr')
    console.log(allRows)
    for (i = 0; i < allRows.length; i++) {
       var row =  allRows.get(i)
       var minutesAwayValue
       var nextTrainValue 
       [minutesAwayValue, nextTrainValue] = calculateNext({frequency: row.dataset.frequency, start: row.dataset.start})
       $('#'+row.dataset.key+" td.next-train").text(nextTrainValue) 
       $('#'+row.dataset.key+" td.min-away").text(minutesAwayValue) 
    }
}

function calculateNext(data) {
    var freq = data.frequency
    var start = moment(data.start, 'HH:mm').subtract(1, "years")
    var delta = moment().diff( moment(start), "minutes");
    var remainder = delta % freq
    var minutesUntil = freq - remainder
    var upcoming = moment().add(minutesUntil, 'minutes').format('h:mm a')
    console.log("upcoming minutes ::: " + minutesUntil)
    console.log("upcoming time ::: " + upcoming)
    result = [minutesUntil, upcoming]
    return result
}

function runTimer() {
    intervalId = setInterval(remakeTable, 60 * 1000);
}

