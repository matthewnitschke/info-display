var blessed = require('blessed');
var moment = require('moment');
var chalk = require('chalk');
var isPromise = require('is-promise')

var screen = blessed.screen({
  warnings: true,
  dockBorders: true
});

var homework = require('./blocks/homework.js')
var dateTime = require('./blocks/clock.js')
var calendar = require('./blocks/calendar.js')

function placeBlock(block, options){
  Object.keys(options).forEach((key) => {
    block[key] = options[key];
  })

  return block
}

var blocks = []

blocks.push(placeBlock(dateTime, {
  top: 0,
  left: 0,
  width: 60,
  height: 4
}));

blocks.push(placeBlock(homework, {
  top: 4,
  left: 0,
  width: 60,
  height: '95%'
}));

blocks.push(placeBlock(calendar, {
  top: 0,
  left: 60,
  height: 20,
  width: '100%-60'
}))

blocks.forEach(block => {
  screen.append(block);

  block.start(screen);
})



// screen.append(placeBlock(hackernews, {
//   top: 0,
//   left: 61,
//   width: 60,
//   height: 17
// }));

// screen.append(placeBlock(email, {
//   top: 17,
//   left: 61,
//   width: 24,
//   height: 3
// }));

// screen.append(placeBlock(speedtest, {
//   top: 17,
//   left: 85,
//   width: 36,
//   height: 4
// }))

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.render();
