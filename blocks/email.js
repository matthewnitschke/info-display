var blessed = require('blessed')
var opn = require('opn')
var api = require('../apis/email.js')

function renderEmail() {
	var msg = api.unreadMessages.length;
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