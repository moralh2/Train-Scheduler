// Initializing the modal, the timepicker, creating the first instance of the makeTable, and calculating the timeout before the minute changes -- at which time, a timer reloads the time calculations every 60 seconds
$(document).ready(function () {
    $(document).ready(function(){ $('.modal').modal() })
    $('.timepicker').timepicker({ twelveHour: false })
    makeTable()
    var nextMinutesInSeconds = (moment().startOf('minute').add(1, 'minutes').diff(moment(), "seconds")) + 2
    setTimeout(function(){ runTimer() }, nextMinutesInSeconds * 1000);
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
var database = firebase.database()

// When the submit button is clicked, the code looks at the key to determine if it's an update (there is a key) or a push (the key says 'new')
$("#train-new-submit").on("click", function (event) {
    event.preventDefault()
    currentKey = $('#form-header')[0].dataset.key
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
        if (currentKey == "new") {
            database.ref().push(dataPush)
            M.Modal.getInstance($('#form-new')).close()
        }
        else if (currentKey[0] == "-") {
            database.ref(currentKey).update(dataPush)
            M.Modal.getInstance($('#form-new')).close()
        }
    }
    //  Prevent blank submissions, display error
    else {
        str = '<div class="col s12"><p class="red-text"><em>Please fill out all of fields</em></p></div>'
        $("#errors").html(str)
    }

});

// When modal is triggered from new-button, clear fields, load appropriate header
$("#open-new-modal").on("click", function (event) {
    $('#form-header').html('<p>ADD NEW TRAIN</p>') 
    $("#train_name").val('')
    $("#train_destination").val('')
    $("#train_start").val('')
    $("#train_frequency").val('')
    $("#errors").html('')
    $('#form-header')[0].dataset.key = 'new'
})

// Train data obj is passed to this function, which creates all of the row elements for the table
function createRow(data) {
    var dataRow = $("<tr>").attr('id', data.key).attr('data-key', data.key).attr('data-start', data.start).attr('data-frequency', data.frequency)
    var nameData = $("<td>").addClass('train-name indigo accent-1 z-depth-3').text(data.name)
    var destinationData = $("<td>").addClass('train-destination').text(data.destination)
    var frequency = $("<td>").addClass('train-frequency').text(data.frequency + ' min')
    var minutesAwayValue
    var nextTrainValue
    [minutesAwayValue, nextTrainValue] = calculateNext(data)
    var rawHtml = '<span class="new badge indigo accent-2 pulse" data-badge-caption="min">in ' + minutesAwayValue + '</span>'
    var nextTrain = $("<td>").addClass("next-train").text(nextTrainValue)
    var minutesAway = $("<td>").addClass("min-away").html(rawHtml)

    var btns = $("<td>")
    var editBtn = $('<a>').addClass("btn-floating btn-small waves-effect waves-light indigo edit-train").html('<i class="material-icons">edit</i>')
    var removeBtn = $('<a>').addClass("btn-floating btn-small waves-effect waves-light red remove-train").html('<i class="material-icons">delete</i>')

    // edit btn event: calls DB, gets current values, loads them on the form, and triggers the modal to open
    editBtn.on("click", function (event) {
        var trainKey = $(this).parent().parent()[0].id
        var train

        database.ref(trainKey).on("value", function(snapshot) {
            train = snapshot.val()
        }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
        });

        $('#form-header').html('<p>EDIT TRAIN</p>') 
        $('#form-header')[0].dataset.key = trainKey
        $("#train_name").val(train.name)
        $("#train_destination").val(train.destination)
        $("#train_start").val(train.start)
        $("#train_frequency").val(train.frequency)
        $("#errors").html('')
        M.Modal.getInstance($('#form-new')).open()
        M.updateTextFields() // Without this, the labels were not updated to active, so the placeholders and the data meshed
    })

    // remove btn triggers for the record to be deleted in firebase using the key
    removeBtn.on("click", function (event) {
        var trainKey = $(this).parent().parent()[0].id
        database.ref(trainKey).remove()
    })

    btns.append(editBtn).append(removeBtn)
    dataRow.append(nameData).append(destinationData).append(frequency).append(nextTrain).append(minutesAway).append(btns)
    $('#table-body').append(dataRow)
}

// This method is called to create the entire table from the entire dataset
function makeTable() {
    $('#current-time').text(moment().format("h:mm A"))
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

// This method is triggered at 60-second intervals to re-load the next train and minutes 'til
function getNewTimes() {
    colorsForPulse = ['orange darken-3', 'deep-orange darken-2']
    colorForPulse = colorsForPulse[ parseInt(moment().format('mm')) % 2 ]
    $('#current-time').text(moment().format("h:mm A"))
    allRows = $('#table-body').children('tr')
    console.log(allRows)
    for (i = 0; i < allRows.length; i++) {
       var row =  allRows.get(i)
       var minutesAwayValue
       var nextTrainValue 
       [minutesAwayValue, nextTrainValue] = calculateNext({frequency: row.dataset.frequency, start: row.dataset.start})
       var rawHtml = '<span class="new badge ' + colorForPulse + ' pulse" data-badge-caption="min">in ' + minutesAwayValue + '</span>'
       $('#'+row.dataset.key+" td.next-train").text(nextTrainValue) 
       $('#'+row.dataset.key+" td.min-away").html(rawHtml)
    }
}

// This method calculates the next train and the minutes away based on given start time and frequency
function calculateNext(data) {
    var freq = data.frequency
    var start = moment(data.start, 'HH:mm').subtract(1, "years")
    var delta = moment().diff( moment(start), "minutes");
    var remainder = delta % freq
    var minutesUntil = freq - remainder
    var upcoming = moment().add(minutesUntil, 'minutes').format('h:mm A')
    console.log("upcoming minutes ::: " + minutesUntil)
    console.log("upcoming time ::: " + upcoming)
    result = [minutesUntil, upcoming]
    return result
}

// This is triggered at the top of the next minute (after page loads), which calls the method to re-calculate times every minute
function runTimer() {
    console.log("started real timer")
    getNewTimes()
    var intervalId = setInterval(getNewTimes, 60 * 1000);
}