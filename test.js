var blessed = require('blessed')
var contrib = require('blessed-contrib')
var moment = require('moment')

var screen = blessed.screen({
	warnings: true,
	dockBorders: true
})

var numWeeks = 4;

var grid = new contrib.grid({
	rows: numWeeks,
	cols: 7,
	screen: screen
})


function getAssignmentContent(){
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve('foo\nfoo\nfoosooe')
		}, 1000)
	})
}

function getEventContent(){
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve('foo\nfoooooo\nelelkeelklke')
		}, 1000)
	})
}

function generateDay(container, isToday) {
	var header = blessed.box({
		parent: container,
		content: 'Saturday 11',
		tags: true,
		top: -1,
		left: -1,
		width: '100%',
		height: 3,
		border: 'line',
	})

	var assignments = blessed.box({
		parent: container,
		top: 2,
		width: '100%-2'
	})

	var events = blessed.box({
		parent: container,
		width: '100%-2',
	})

	this.populateContent = async () => {
		try {
			assignments.content = await getAssignmentContent()
			events.content = await getEventContent()
		} catch(e){
			throw new Error(e)
		}
		
		
		recalculateEventsTop();

		screen.render()
	}

	function recalculateEventsTop(){
		var containerHeight = container.height - 2 // height of container minus the 2 constant (literally no idea why i need this)
		events.top = containerHeight - events.content.split('\n').length
	}

	if (isToday){
		container.style.border.fg = 'red'
		header.style.border.fg = 'red'
	}

	this.populateContent();
}

for (var w = 0; w < numWeeks; w++) {
	for (var d = 0; d < 7; d++) {
		var isToday = w == 0 && d == 0

		var dayContainer = grid.set(w, d, 1, 1, blessed.box, {style:{border:{fg: 'bg'}}})
		
		generateDay(dayContainer, isToday)
	}
}

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
	return process.exit(0)
})

screen.render()
