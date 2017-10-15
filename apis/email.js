var MailListener = require('mail-listener2');
var config = require('../config.json').email

var mailListener = new MailListener({
	username: config.username,
	password: Buffer.from(config.password, 'base64').toString(),
	host: config.host,
	port: 993,
	tls: true,
	fetchUnreadOnStart: true
});

module.exports = {
    unreadMessages: [],
}

mailListener.on("mail", (email) => {
	module.exports.unreadMessages.push(email);
})

mailListener.start();