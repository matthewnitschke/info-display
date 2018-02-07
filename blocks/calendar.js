var blessed = require("blessed");
var moment = require("moment");
var homeworkApi = require("../apis/homework.js");

var config = {
  daysVisible: 21,
  currentDayFirst: false
};

function CalendarBox(date) {
  this.date = date;

  let dayContainer = blessed.box({
    parent: calendar,
    height: "100%",
    width: 29
  });

  let homeworkBox = blessed.box({
    parent: dayContainer,
    tags: true,
    content: "loading...",
    label: date.format("dddd-D"),
    border: "line"
  });

  var renderHomeworkData = (subjects) => {
    var retText = "";

    subjects.forEach(subject => {
      
      var hasIncompleteAssignment = false; // only render if subject has a incomplete assignment

      var subjectAssignements = "";
      subject.assignments.forEach(assignment => {
        var assignmentDate = moment(assignment.due, "MM/DD/YYYY");
        if (this.date.isSame(assignmentDate, "day")) {
          if (assignment.complete){
            subjectAssignements += ` {gray-fg}${assignment.name.trim()}{/gray-fg}\n`;
          } else {
            subjectAssignements += ` • ${assignment.name.trim()}\n`;
            hasIncompleteAssignment = true;
          }
        }
      });

      if (hasIncompleteAssignment && subjectAssignements != "") {
        retText += `{${subject.color}-fg}${subject.subject}\n${subjectAssignements}{/${subject.color}-fg}\n\n`;
      }
    });

    return retText;
  }

  var updateBorder = () => {
    var borderColor = moment().isSame(date, "day") ? "red" : "white";
    homeworkBox.style.border.fg = borderColor;
  }

  this.update = function(subjects) {
    homeworkBox.content = renderHomeworkData(subjects);
    updateBorder()
  };

  updateBorder()
}

var calendar = blessed.layout({
  height: 0, // layout requires width and height, so fake it
  width: 0
});

var days = [];
var ithDay = moment();
if (!config.currentDayFirst){
  ithDay.startOf('week');
}

for (var i = 0; i < config.daysVisible; i++) {
  days.push(new CalendarBox(ithDay.clone()));
  ithDay.add(1, "day");
}

calendar.start = function(screen) {
  var interval = async () => {
    let subjects = await homeworkApi.getHomework()

    days.forEach(day => {
      day.update(subjects)
    })

    screen.render()
  }

  setInterval(interval, 3600000);

  interval();
};

module.exports = calendar;
