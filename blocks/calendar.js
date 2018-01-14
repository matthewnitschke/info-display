var blessed = require("blessed");
var moment = require("moment");
var homeworkApi = require("../apis/homework.js");
var summariesApi = require("../apis/classSummary.js");

var config = {
  daysVisible: 14,
  currentDayFirst: false
};

var subjects = [];
var summaries = {};

function CalendarBox(date) {
  this.date = date;

  let dayContainer = blessed.box({
    parent: calendar,
    height: "100%",
    width: 30
  });

  let homeworkBox = blessed.box({
    parent: dayContainer,
    tags: true,
    content: "loading...",
    label: date.format("dddd-D"),
    border: "line",
    style: {
      border: {
        fg: moment().isSame(date, "day") ? "red" : "white"
      }
    }
  });

  let summaryBox = blessed.box({
    parent: dayContainer,
    bottom: 0,
    left: 0,
    tags: true,
    content: 'loading...',
    height: 5,
    border: "line",
    padding: 0,
    style: {
      border: {
        fg: moment().isSame(date, "day") ? "red" : "white"
      }
    }
  });

  function renderHomeworkData(date) {
    var retText = "";

    subjects.forEach(subject => {
      var subjectAssignements = "";
      subject.assignments.forEach(assignment => {
        var assignmentDate = moment(assignment.due, "MM/DD/YYYY");
        if (date.isSame(assignmentDate, "day")) {
          subjectAssignements += "\t" + assignment.name + "\n";
        }
      });

      if (subjectAssignements != "") {
        retText += `{${subject.color}-fg}${
          subject.subject
        } \n ${subjectAssignements}{/${subject.color}-fg}\n\n`;
      }
    });

    return retText;
  }

  function renderSummaryData(date){
    function hasSummary(subject) {
      if (summaries[subject.subject]) {
        return summaries[subject.subject].indexOf(date.format("MM/DD/YYYY")) > -1;
      }
      return false;
    }
  
    var retSubjects = "";
  
    subjects.forEach(subject => {
      subject.meetingDays.split(",").forEach(day => {
        var meetingDay = moment(day, "ddd");
  
        if (meetingDay.format("ddd") === date.format("ddd")) {
          var prefix = hasSummary(subject)
            ? `{green-fg}\u2714{/green-fg}`
            : `{red-fg}\u2718{/red-fg}`;
          retSubjects += ` ${prefix} ${subject.subject}\n`;
        }
      });
    });
  
    return retSubjects;
  }

  this.update = function() {
    homeworkBox.content = renderHomeworkData(this.date);
    summaryBox.content = renderSummaryData(this.date);
  };
}

function updateHomeworkData() {
  return homeworkApi.getHomework().then(subjectsData => {
    subjects = subjectsData;
  });
}

function updateSummaryData(){
  return summariesApi.getSummaries(subjects).then(summariesData => {
    summaries = summariesData
  })
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
  var interval = () => {
    updateHomeworkData()
    .then(updateSummaryData)
    .then(() => {
      days.forEach(day => {
        day.update();
      })
      screen.render();
    });
  }

  setInterval(interval, 60000);

  interval();
};

module.exports = calendar;
