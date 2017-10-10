var blessed = require('blessed')
var moment = require('moment')

function generateDateTime(){
  return `${moment().format("h:mm a")}
${moment().format("MM/DD/YYYY")}`;
}

module.exports = {
  element: blessed.box({
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
  }),

  render: () => { return generateDateTime() }


}
