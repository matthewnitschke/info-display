var blessed = require('blessed');
var hn = require("node-hacker-news");
var opn = require('opn')

function getHNArticles(){
  return new Promise((resolve, reject) => {
    hn.topstories(function(err, stories){

      storyPromises = stories.splice(0, 5).map((storyId) => {
        return new Promise((storyResolve, reject) => {
          hn.item(storyId, function(err, item){
            storyResolve(item);
          })
        });
      })

      Promise.all(storyPromises).then((storiesText) => {

        resolve(storiesText.map((s) => {
          return s.title
        }).join('\n\n'))
      })
    });
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
