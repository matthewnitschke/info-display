const config = require('../config.json').googleCalendar

let google = require("googleapis").google;

var calendar = null;
let jwtClient = new google.auth.JWT(
  config.clientEmail,
  null,
  config.privateKey,
  ["https://www.googleapis.com/auth/calendar"]
);
jwtClient.authorize(function(err, tokens) {
  if (err) {
    console.log(err);
    return;
  } else {
    calendar = google.calendar('v3');
  }
});


module.exports = {
    getEvents: (from, to) => {
        return new Promise((resolve, reject) => {
            if (!calendar){
                throw new Error("Client not ready yet")
            }

            calendar.events.list({
                auth: jwtClient,
                calendarId: config.calendarId,
                orderBy: "startTime",
                timeMin: from.format(),
                timeMax: to.format()
            }, function (err, response) {
                response.data.items.forEach(function(e){
                    events.push(new Event(e))
                })
            });
        })
    }
}