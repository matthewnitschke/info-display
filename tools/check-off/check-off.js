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

    if (dateA.isSame(dateB)){
      return 1
    } else {
      if (dateA.isBefore(dateB)) {
        return -1;
      } else {
        return 1;
      }
    }    
  });

  var form = blessed.form({
    parent: subjectBox,
    width: "100%-4",
    height: "100%-4",
    tags: true
  });

  assignments.forEach((assignment, i) => {
    var name = assignment.complete
      ? `{grey-fg}${assignment.name}{/grey-fg}`
      : assignment.name;

    var checkbox = blessed.checkbox({
      parent: form,
      tags: true,
      checked: !!assignment.complete,
      mouse: true,
      text: name,
      width: "100%-4",
      height: 1,
      left: 2,
      top: i
    });

    checkbox.on("check", () => {
      assignment.complete = true;
      saveData();
    });

    checkbox.on("uncheck", () => {
      assignment.complete = false;
      saveData();
    });

    var deleteButton = blessed.button({
      parent: form,
      content: '∅',
      top: i,
      left: 0,
      width: 1,
      height: 1,
      tags: true,
      mouse: true
    })
    deleteButton.on("press", () => {
      deleteItemPrompt(assignment, subject)
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

function addItemPrompt(subject){
  var addItemPrompt = blessed.question({
    parent: screen,
    width: "shrink",
    height: 9,
    left: "center",
    top: "center",
    border: {
      type: "line"
    }
  });

  var input = blessed.textbox({
    parent: addItemPrompt,
    height: 3,
    top: 4,
    mouse: true,
    width: "100%-2",
    label: ' Name, Due ',
    name: 'name',
    inputOnFocus: true,
    value: '',
    border: {
      type: "line"
    }
  })

  addItemPrompt.ask("Enter new assignment information", (e, isOkay) => {
    if(isOkay){
      var splitData = input.value.split(",").map(x => x.trim())
      if (splitData.length == 2){
        subject.assignments.push({
          name: splitData[0],
          due: splitData[1]
        })
        saveData()
      }
    }
    screen.render();
  });
}

function deleteItemPrompt(assignment, subject) {
  var removeItemPrompt = blessed.question({
    parent: screen,
    width: "shrink",
    height: "shrink",
    left: "center",
    top: "center",
    border: {
      type: "line"
    }
  });

  removeItemPrompt.ask(`Are you sure you want to delete: ${assignment.name}?`, (e, isOkay) => {
    if(isOkay){
      var index = subject.assignments.indexOf(assignment);
      delete subject.assignments[index];
      saveData();
    }
    screen.render()
  });
}

function draw() {
  if (contentBox) {
    screen.remove(contentBox);
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
        left: 0,
        right: 0,
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

    generateAssignments(subjectBox, subject);

    
    var addButtonWrapper = blessed.box({
      parent: subjectBox,
      bottom: 0,
      width: "100%-2",
    });

    var addButton = blessed.button({
      parent: addButtonWrapper,
      tags: true,
      mouse: true,
      width: "shrink",
      height: "shrink",
      right: 1,
      padding: {
        left: 1,
        right: 1
      },
      style:{
        bg: subject.color,
        fg: "black"
      },
      content: '+',
    })

    addButton.on("press", () => {
      addItemPrompt(subject)
    });
  });

  screen.render();
}

getData();

screen.key(["escape", "q", "C-c"], function(ch, key) {
  return process.exit(0);
});

screen.render();
