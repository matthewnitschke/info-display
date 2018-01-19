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
blocks.push(placeBlock(calendar, {
  top: 1,
  left: 1,
  height: 20,
  width: '100%'
}))

blocks.forEach(block => {
  screen.append(block);
  block.start(screen);
})

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.render();
