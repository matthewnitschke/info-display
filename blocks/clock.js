var blessed = require('blessed')
var api = require("../apis/clock.js")

function generateDateTime(){
  var time = api.getTime();

  return `${time.time}
${time.date}`;
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
