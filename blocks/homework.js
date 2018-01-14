var blessed = require('blessed')
var moment = require('moment')
var api = require('../apis/homework.js')

var block = blessed.box({
  label: 'Homework',
  content: '',
  align: 'left',
  tags: true,
  padding: {
    top: 1,
    left: 2,
    right: 2,
    bottom: 1
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
})

function generateHomeworkText() {
  return api.getHomework().then((homework) => {
    var ret = ""
    homework.forEach((subject) => {
      ret += subject.subject + "\n";
      subject.assignments.forEach((assignment) => {
        dueDate = moment(assignment.due, "MM/DD/YYYY")
        dueDateText = dueDate.format("MM/DD");

        if (!(dueDate.isBefore(moment()) && assignment.complete)) {
          if (!assignment.complete) {
            if (dueDate.isBefore(moment()) || dueDate.isBetween(moment(), moment().add(1, 'day'))) {
              dueDateText = `{red-fg}${dueDate.format("MM/DD")}{/red-fg}`
            } else if (dueDate.isBetween(moment(), moment().add(3, 'day'))) {
              dueDateText = `{yellow-fg}${dueDate.format("MM/DD")}{/yellow-fg}`
            }
          }

          ret += `\t ${assignment.complete ? '{grey-fg}*' : ''}${assignment.name} - ${dueDateText}${assignment.complete ? '*{/grey-fg}' : ''}\n`
        }

      })
      ret += "\n\n"
    })

    return ret
  })

}

function renderBlock(screen){
  generateHomeworkText().then(data => {
    block.content = data;
    screen.render();
  })
}

block.start = function(screen){
  renderBlock(screen); // initial render

  setInterval(() => {
    renderBlock(screen);
  }, 60000)
}

module.exports = block;