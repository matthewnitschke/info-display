var config = require("../config.json").gist
var Gist = require("gist.js")

var gist = Gist(config.gistID)
  .token(config.gistToken)

module.exports = {
    getHomework: () => {
        return new Promise((resolve, reject) => {
            gist.get((err, json) => {
                if (err) { 
                    reject(err) 
                } else {

                    var filename = Object.keys(json.files)[0];
                    var content = JSON.parse(json.files[filename].content);
                    resolve(content);
                }

            })
        })
    },
    saveHomework: (homework) => {
        return new Promise((resolve, reject) => {
            gist.write(homework)
                .save((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                })
        })
        
    }

}