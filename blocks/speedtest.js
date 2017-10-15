var blessed = require('blessed')
var api = require("../apis/speedtest.js")

function generateView(){
    return `Download: ${api.download}
Upload: ${api.upload}`;
}

module.exports = {
  element: blessed.box({
    label: 'Speedtest',
    content: generateView(),
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

  render: generateView
}
