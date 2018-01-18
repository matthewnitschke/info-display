const blessed = require("blessed");
const moment = require('moment');

var config = require("../../config.json").gist;
var Gist = require("gist.js");
var gist = Gist(config.gistID).token(config.gistToken);

var screen = blessed.screen({
  warnings: true,
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
  keys: true,
  alwaysScroll: true,
  scrollbar: {
    ch: " ",
    inverse: true
  }
});

function generateItems(subject){
  var assignments = subject.assignments;

  // assignments.sort((a, b) => {
  //   if (a.complete && !b.complete){
  //     return 1
  //   } else if (b.complete && !a.complete){
  //     return -1
  //   }
  //   var dateA = moment(a.due, "MM/DD/YYYY");
  //   var dateB = moment(a.due, "MM/DD/YYYY");    
  // });

  assignments.push({})
  return assignments.map(assignment => {
    if (assignment.name){
      return (assignment.complete ? `{red-fg}${assignment.name}{/red-fg}` : assignment.name);
    } else {
      return ""
    }
  })
}

gist.get((err, json) => {
  if (err) {
    reject(err);
  } else {
    var filename = Object.keys(json.files)[0];
    var subjects = JSON.parse(json.files[filename].content);

    subjects.forEach(subject => {
      var subjectBox = blessed.list({
        parent: contentBox,
        label: `{${subject.color}-fg} ${subject.subject} {/${subject.color}-fg}`,
        width: "100%",
        height: "shrink",
        tags: true,
        padding: {
          top: 0,
          left: 1,
          right: 1,
          bottom: 0
        },
        items: generateItems(subject),
        border: {
          type: "line"
        },
        style: {
          selected: {
            fg: 'red'
          },
          border: {
            fg: subject.color
          }
        }
      });
    });

    screen.render();
  }
});

screen.key(["escape", "q", "C-c"], function(ch, key) {
  return process.exit(0);
});

screen.render();
