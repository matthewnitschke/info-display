var hn = require("node-hacker-news");

module.exports = {
    getLatestNews: () => {
        return new Promise((resolve, reject) => {
            hn.topstories(function (err, stories) {

                storyPromises = stories.splice(0, 5).map((storyId) => {
                    return new Promise((storyResolve, reject) => {
                        hn.item(storyId, function (err, item) {
                            storyResolve(item);
                        })
                    });
                })

                Promise.all(storyPromises).then((stories) => {
                    resolve(stories);
                })
            });
        });
    }
}