# Train Scheduler v3.2.0

## HW 7 - Train-Scheduler:

The main focus area for this assigment was the use of Firebase in order to load content unto the page from a remote database. In addition, Moment.js was used to make time calculations.

When the page loads, all of the data stored in Firebase is received; the data is then consumed and uploaded to the page by creating table elements dynamically. While some of the data is loaded as-is (name, destination, frequency), the train's next arrival is calculated with the start time and the frequency for each train using Moment.js: the time at which the train will arrive and how many minutes until then are calculated and appended to the table.

At the end of each row, there is an edit button and a delete button for every train. The edit button triggers a call to the DB to get the current values, loads these unto the form that is hidden in the modal, and triggers the modal to open. The delete button simply triggers an immediate removal of the respective record from the DB. 

In addition, there is a button to add a new train, which triggers the same modal to open, but with none of the fields populated; and submission of the form (with all fields entered) will trigger a push to the Firebase DB, which then triggers for all of the trains schedules to be updated on the table.

## Tackled Extra Challenges: 
(1) The page will update the arrival times at the top of every minute: a timeout calculates when the next minute will happen, upon which it triggers a timer that calls a function every 60 seconds to update the arrival times.
(2) User can edit and delete trains: the edit button loads the form with the current DB values, and makes a push when the form submits. The delete button triggers the record to be removed. In order to do these two tasks, the important thing was having access to the unique key (ID) used in the DB for each record.