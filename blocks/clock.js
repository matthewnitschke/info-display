var blessed = require('blessed')
var moment = require('moment')


var block = blessed.box({
  content: generateDateTime(),
  align: 'center',
  valign: 'middle',
  tags: true,
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

function generateDateTime(){
  var time = moment().format("h:mm:ss a")
  var date = moment().format("M/DD/YYYY")

  return `${time}
${date}`;
}

function renderBlock(){
  block.content = generateDateTime();
}


block.start = function(screen) {
  setInterval(() => {
    renderBlock();
    screen.render();
  }, 1000);
}


module.exports = block;