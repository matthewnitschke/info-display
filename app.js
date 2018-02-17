var blessed = require('blessed')
var contrib = require('blessed-contrib')
var moment = require('moment')
var homeworkApi = require('./apis/homework.js')
var googleCalendarApi = require('./apis/googleCalendar.js')

var foodListenerApi = require('./apis/foodListener.js')

var screen = blessed.screen({
	warnings: true,
	dockBorders: true
})

var numWeeks = 4
var grid = new contrib.grid({
	rows: numWeeks,
	cols: 7,
	screen: screen
})

function Day(container, date) {
	this.date = date

	var header = blessed.box({
		parent: container,
		content: date.format('dddd D'),
		tags: true,
		top: -1,
		left: -1,
		width: '100%',
		height: 3,
		border: 'line'
	})

	var assignments = blessed.box({
		parent: container,
		tags: true,
		top: 2,
		width: '100%-2'
	})

	var events = blessed.box({
		parent: container,
		tags: true,
		width: '100%-2'
	})

	let getAssignmentContent = subjects => {
		var retText = ''
		subjects.forEach(subject => {
			var hasIncompleteAssignment = false // only render if subject has a incomplete assignment

			var subjectAssignements = ''
			subject.assignments.forEach(assignment => {
				var assignmentDate = moment(assignment.due, 'MM/DD/YYYY')
				if (this.date.isSame(assignmentDate, 'day')) {
					if (assignment.complete) {
						subjectAssignements += ` {gray-fg}${assignment.name.trim()}{/gray-fg}\n`
					} else {
						subjectAssignements += ` • ${assignment.name.trim()}\n`
						hasIncompleteAssignment = true
					}
				}
			})

			if (hasIncompleteAssignment && subjectAssignements != '') {
				retText += `{${subject.color}-fg}${
					subject.subject
				}\n${subjectAssignements}{/${subject.color}-fg}\n\n`
			}
		})
		return retText
	}

	let getEventContent = events => {
		let retText = ''
		events.forEach(eventData => {
			if (eventData.start){
				let eventStart = eventData.start.dateTime ? eventData.start.dateTime : eventData.start.date
				//console.log(eventData.description)
				if (this.date.isSame(eventStart, 'day') && (eventData.description ? eventData.description.indexOf('{{hidden}}') <= -1 : true)){
					retText += `${eventData.summary}\n`
				}
			}
		})
		return retText
	}

	this.populateContent = (assignmentsData, eventsData) => {
		try {
			assignments.content = getAssignmentContent(assignmentsData)
			events.content = getEventContent(eventsData)
		} catch (e) {
			throw new Error(e)
		}

		recalculateEventsTop()
	}

	function recalculateEventsTop() {
		var containerHeight = container.height - 2 // height of container minus the 2 constant (literally no idea why i need this)
		events.top = containerHeight - events.content.trim().split('\n').length
	}

	if (moment().isSame(this.date, 'day')) {
		container.style.border.fg = 'red'
		header.style.border.fg = 'red'
	}
}

var days = []
var ithDay = moment()
ithDay.startOf('week')

var firstDay = ithDay.clone()

for (var w = 0; w < numWeeks; w++) {
	for (var d = 0; d < 7; d++) {
		var dayContainer = grid.set(w, d, 1, 1, blessed.box, {
			style: { border: { fg: 'bg' } }
		})

		days.push(new Day(dayContainer, ithDay.clone()))
		ithDay.add(1, 'day')
	}
}

var lastDay = ithDay.clone()

var interval = async () => {
	let assignments = await homeworkApi.getHomework()
	let events = await googleCalendarApi.getEvents(firstDay, lastDay)

	days.forEach(day => {
		day.populateContent(assignments, events)
	})

	screen.render()
}

setInterval(interval, 3600000)
interval()

var foodNotify = null;
foodListenerApi.startListening()
foodListenerApi.onFood = () => {
	if (!foodNotify){
		foodNotify = blessed.box({
			parent: screen,
			content: 'FOOD!',
			width: 9,
			align: 'center',
			height:1,
			left: '50%-5',
			bottom: 0,
			style: {
				bg: 'red',
				fg: 'white'
			}
		})
		screen.render()
		setTimeout(() => {
			foodNotify.destroy()
			screen.render()
		}, 86400000) // wait one day
	}
}
	
foodListenerApi.onNoneFound = () => {
	if (foodNotify){
		foodNotify.destroy()
		screen.render()
	}
}

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
	return process.exit(0)
})

screen.render()
