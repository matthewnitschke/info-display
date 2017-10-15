var moment = require('moment')

module.exports = {
    getTime: () => {
        return {
            time: moment().format("h:mm a"),
            date: moment().format("MM/DD/YYYY") 
        }
    }
}