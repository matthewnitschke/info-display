var MailListener = require('mail-listener2');
var {email, foodListener} = require('../config.json')

var mailListener = new MailListener({
	username: email.username,
	password: Buffer.from(email.password, 'base64').toString(),
	host: email.host,
	port: 993,
	tls: true,
	fetchUnreadOnStart: true
});

var foodEmails = new RegExp(foodListener.triggerEmails.regex, foodListener.triggerEmails.flags)
var foodMatcher = new RegExp(foodListener.triggerWords.regex, foodListener.triggerWords.flags)

let foodSearch = (email) => {
    var foodFound = false

    var fromList = email.from.filter((data) => {
        return  !!data.address.match(foodEmails)
    })

    if (fromList.length > 0){
        if(!!email.text.match(foodMatcher)){
            foodFound = true
            module.exports.onFood()
        }
    }

    if (!foodFound){
        module.exports.onNoneFound()
    }
}

mailListener.on("mail", (email) => {
	foodSearch(email)
})

module.exports = {
    onFood: () => {},
    startListening: () => {
        mailListener.start();
    }
}