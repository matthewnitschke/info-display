var config = require("../config.json").gist
var Gist = require("gist.js")

module.exports = {
    getHomework: () => {
        return new Promise((resolve, reject) => {
            // re-auth each time because for some reason without this it doesnt work
            var gist = Gist(config.gistID)
                .token(config.gistToken)
            
            gist.get((err, json) => {
                if (err) { 
                    reject(err) 
                } else {
                    var content = JSON.parse(json.files[config.gistFilename].content);
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