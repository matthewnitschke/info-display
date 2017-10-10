var blessed = require('blessed');
var moment = require('moment');

// Create a screen object.
var screen = blessed.screen();

var homework = `Stats
ESof
Computer Archatecture
Networks`

// Create a box perfectly centered horizontally and vertically.
var dateTime = blessed.box({
  top: '0%',
  left: '0%',
  width: '7%',
  height: '9%',
  content: `${moment().format("H:mm a")}
${moment().format("MM/DD/YYYY")}`,
  align: 'center',
  valign: 'middle',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    border: {
      fg: '#ffffff'
    },
    hover: {
      bg: 'green'
    }
  }
});

// Dates one day away are in red, 3 days away are yellow, more than 3 are white 
var homework = blessed.box({
  label: 'Homework',
  top: '10%',
  left: '0%',
  width: '10%',
  height: '9%',
  content: homework,
  align: 'left',
  valign: 'middle',
  padding: '2',
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    border: {
      fg: '#ffffff'
    },
    hover: {
      bg: 'green'
    }
  }
})

// Append our box to the screen.
screen.append(dateTime);
screen.append(homework);

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});


// Render the screen.
screen.render();
