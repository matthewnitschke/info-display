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

var contentBox;
var subjectBoxes = [];

function generateAssignments(subjectBox, subject) {
  var assignments = subject.assignments;

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

  assignments.forEach(assignment => {
    var name = assignment.complete
      ? `{grey-fg}${assignment.name}{/grey-fg}`
      : assignment.name;

    var form = blessed.form({
      parent: subjectBox,
      width: "100%-4",
      height: 1,
      tags: true
    });

    var checkbox = blessed.checkbox({
      parent: form,
      tags: true,
      checked: !!assignment.complete,
      mouse: true,
      text: name
    })

    checkbox.on('check', () => {
      assignment.complete = true
      saveData()
    })

    checkbox.on('uncheck', () => {
      assignment.complete = false
      saveData()
    })
    
  });
}

var data = [];
function getData() {
  gist.get((err, json) => {
    if (!err) {
      var subjects = JSON.parse(json.files[config.gistFilename].content);

      data = subjects;
      draw();
    }
  });
}

function saveData() {
  gist.file(config.gistFilename).write(JSON.stringify(data));

  gist.save(draw);
}

function draw(){
  if (contentBox){
    screen.remove(contentBox)
  }

  contentBox = blessed.layout({
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

  data.forEach((subject, i) => {
    var subjectBox = blessed.layout({
      parent: contentBox,
      label: `{${subject.color}-fg}${subject.subject}{/${subject.color}-fg}`,
      width: "100%",
      height: "25%-1",
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

getData();

screen.key(["escape", "q", "C-c"], function(ch, key) {
  return process.exit(0);
});

screen.render();
