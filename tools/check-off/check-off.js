const blessed = require("blessed");
const moment = require("moment");

var config = require("../../config.json").gist;
var Gist = require("gist.js");
var gist = Gist(config.gistID).token(config.gistToken);

var screen = blessed.screen({
  warnings: true,
  smartCSR: true,
  dockBorders: true
});

var contentBox = blessed.layout({
  parent: screen,
  top: 0,
  left: 1,
  tags: true,
  padding: {
    top: 1
  },
  style: {
    focus: {
      border: {
        fg: "blue"
      }
    }
  },
  vi: true,
  scrollable: true,
  alwaysScroll: true,
  scrollbar: {
    ch: " ",
    inverse: true
  }
});

var subjectBoxes = [];

function generateAssignments(subjectBox, subject) {
  var assignments = JSON.parse(JSON.stringify(subject.assignments));

  assignments = assignments.sort((a, b) => {
    if (a.complete && !b.complete) {
      return 1;
    } else if (b.complete && !a.complete) {
      return -1;
    }

    var dateA = moment(a.due, "MM/DD/YYYY");
    var dateB = moment(b.due, "MM/DD/YYYY");

    if (dateA.isBefore(dateB)) {
      return -1;
    } else {
      return 1;
    }
  });

  assignments.push({});

  assignments.forEach(assignment => {
    var name = assignment.complete
      ? `{grey-fg}${assignment.name}{/grey-fg}`
      : assignment.name;

    blessed.box({
      parent: subjectBox,
      width: "100%-4",
      height: 1,
      content: name,
      tags: true
    });
  });
}

var data = [];
function getData() {
  gist.get((err, json) => {
    if (!err) {
      var filename = Object.keys(json.files)[0];
      var subjects = JSON.parse(json.files[filename].content);

      data = subjects;

      subjects.forEach((subject, i) => {
        var subjectBox = blessed.layout({
          parent: contentBox,
          label: `{${subject.color}-fg}${subject.subject}{/${subject.color}-fg}`,
          width: "100%",
          height: "25%",
          tags: true,
          vi: true,
          scrollable: true,
          keys: true,
          alwaysScroll: true,
          scrollbar: {
            ch: " ",
            inverse: true
          },
          padding: {
            top: 0,
            left: 1,
            right: 1,
            bottom: 0
          },
          border: {
            type: "line"
          },
          style: {
            border: {
              fg: subject.color
            }
          }
        });

        if (i == 0){
          subjectBox.focus();
        }

        generateAssignments(subjectBox, subject);
      });

      screen.render();
    }
  });
}

function updateItem(text) {
  for (var i = 0; i < data.length; i++) {
    var subject = data[i];

    for (var j = 0; j < subject.assignments.length; j++) {
      var assignment = subject.assignments[j];

      if (assignment.name == text) {
        var isComplete = data[i].assignments[j].complete ? false : true;
        console.log(isComplete);
        data[i].assignments[j].complete = isComplete;
        updateGist(data);
        return;
      }
    }
  }
}

function updateGist(data) {
  gist.file("info-display-homework.json").write(JSON.stringify(data));

  gist.save(getData);
}

getData();

screen.key(["escape", "q", "C-c"], function(ch, key) {
  return process.exit(0);
});

screen.render();
