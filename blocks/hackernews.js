var blessed = require('blessed')
var api = require('../apis/hackernews.js')
var opn = require('opn')

function getHNArticles(){

  return api.getLatestNews().then((news) => {
    return news.map((story) => {
      return story.title
    }).join('\n\n');
  });
}

module.exports = {
  element: blessed.box({
    label: 'Hacker News',
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
      },
      hover: {
        bg: 'grey'
      }
    }
  }),

  render: getHNArticles
}

module.exports.element.on('click', () => {
  opn('https://news.ycombinator.com/');
})
