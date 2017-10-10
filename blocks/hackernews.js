var blessed = require('blessed');
var hn = require("node-hacker-news");

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
        var storyLines = storiesText.map((s) => {
          return s.title
        }).join('\n\n');

        resolve(storyLines)
      })


        // if (err){
        //   resolve(err)
        // } else {
        //   resolve(stories);
        // }
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
      }
    }
  }),

  render: getHNArticles
}
