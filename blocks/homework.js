var blessed = require('blessed')
var moment = require('moment')

var homework = [
  {
    subject: "Software Engineering",
    assignments: [
      {
        name: "Midterm",
        due: "10/12/2017"
      }
    ]
  },
  {
    subject: "Stats",
    assignments: [
      {
        name: "Ch 2 Exploration",
        due: "10/16/2017"
      }
    ]
  },
  {
    subject: "Networks",
    assignments: [
      {
        name: "Lab 2",
        due: "10/11/2017",
        complete: true
      }
    ]
  },
  {
    subject: "Computer Archatecture",
    assignments: [
      {
        name: "HW 2",
        due: "10/16/2017"
      }
    ]
  }
]

function generateHomeworkText(homework){
  var ret = ""
  homework.forEach((subject) => {
    ret += subject.subject + "\n";
    subject.assignments.forEach((assignment) => {
      dueDate = moment(assignment.due, "MM/DD/YYYY")
      dueDateText = dueDate.format("MM/DD");

      if (!(dueDate.isBefore(moment()) && assignment.complete)){
        if (!assignment.complete){
          if (dueDate.isBefore(moment()) || dueDate.isBetween(moment(), moment().add(1, 'day'))){
            dueDateText = `{red-fg}${dueDate.format("MM/DD")}{/red-fg}`
          } else if (dueDate.isBetween(moment(), moment().add(3, 'day'))) {
            dueDateText = `{yellow-fg}${dueDate.format("MM/DD")}{/yellow-fg}`
          }
        }

        ret += `\t ${assignment.complete ? '{grey-fg}*' : '' }${assignment.name} - ${dueDateText}${assignment.complete ? '*{/grey-fg}' : ''}`
      }

    })
    ret += "\n\n"
  })

  return ret
}

module.exports = {
  element: blessed.box({
    label: 'Homework',
    content: generateHomeworkText(homework),
    align: 'left',
    tags: true,
    padding: {
      top: 0,
      left: 1,
      right: 1,
      bottom: 0
    },
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      border: {
        fg: '#ffffff'
      }
    }
  }),

  render: () => { return generateHomeworkText(homework) }

}
