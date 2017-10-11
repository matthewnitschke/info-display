var blessed = require('blessed');
var MailListener = require('mail-listener2');
var opn = require('opn');

var config = require('../config.json');

var mailListener = new MailListener({
	username: config.email.username,
	password: Buffer.from(config.email.password, "base64").toString(),
	host: config.email.host,
	port: 993,
	tls: true,
	fetchUnreadOnStart: true
});

unreadMessages = [];

mailListener.on("mail", (email) => {
	unreadMessages.push(email);
})

function renderEmail() {
	var msg = unreadMessages.length;
	return `Unread Messages: {green-fg}${msg}{/green-fg}`
}

module.exports = {
	element: blessed.box({
		label: 'Email',
		content: renderEmail(),
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

	render: renderEmail
}

module.exports.element.on('click', () => {
	opn('http://inbox.google.com');
})

mailListener.start();