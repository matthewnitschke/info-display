var blessed = require("blessed");
var moment = require("moment");
var homeworkApi = require("../apis/homework.js");
var summariesApi = require("../apis/classSummary.js");

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

  let summaryBox = blessed.box({
    parent: dayContainer,
    bottom: 0,
    left: 0,
    tags: true,
    content: 'loading...',
    height: 5,
    border: "line",
    padding: 0
  });

  var renderHomeworkData = (subjects) => {
    var retText = "";

    subjects.forEach(subject => {
      var subjectAssignements = "";
      subject.assignments.forEach(assignment => {
        var assignmentDate = moment(assignment.due, "MM/DD/YYYY");
        if (this.date.isSame(assignmentDate, "day")) {
          if (assignment.complete){
            subjectAssignements += ` {gray-fg}${assignment.name.trim()}{/gray-fg}\n`;
          } else {
            subjectAssignements += ` • ${assignment.name.trim()}\n`;
          }
        }
      });

      if (subjectAssignements != "") {
        retText += `{${subject.color}-fg}${subject.subject}\n${subjectAssignements}{/${subject.color}-fg}\n\n`;
      }
    });

    return retText;
  }

  var renderSummaryData = (subjects, summaries) => {
    var hasSummary = (subject) => {
      if (summaries[subject.subject]) {
        return summaries[subject.subject].indexOf(this.date.format("MM/DD/YYYY")) > -1;
      }
      return false;
    }
  
    var retSubjects = "";
  
    subjects.forEach(subject => {
      subject.meetingDays.split(",").forEach(day => {
        var meetingDay = moment(day, "ddd");
  
        if (meetingDay.format("ddd") === this.date.format("ddd")) {
          var prefix = hasSummary(subject)
            ? `{green-fg}\u2714{/green-fg}`
            : `{red-fg}\u2718{/red-fg}`;
          retSubjects += ` ${prefix} ${subject.subject}\n`;
        }
      });
    });
  
    return retSubjects;
  }

  var updateBorder = () => {
    var borderColor = moment().isSame(date, "day") ? "red" : "white";
    summaryBox.style.border.fg = borderColor;
    homeworkBox.style.border.fg = borderColor;
  }

  this.update = function(subjects, summaries) {
    homeworkBox.content = renderHomeworkData(subjects);
    summaryBox.content = renderSummaryData(subjects, summaries);
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
    let summaries = await summariesApi.getSummaries(subjects)

    days.forEach(day => {
      day.update(subjects, summaries)
    })

    screen.render()
  }

  setInterval(interval, 30000);

  interval();
};

module.exports = calendar;
