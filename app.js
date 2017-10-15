var blessed = require('blessed');
var moment = require('moment');
var chalk = require('chalk');
var isPromise = require('is-promise')

var screen = blessed.screen();
screen._listenedMouse = true;

var homework = require('./blocks/homework.js')
var dateTime = require('./blocks/clock.js')
var hackernews = require('./blocks/hackernews.js')
var email = require('./blocks/email.js')

function placeBlock(block, options){
  Object.keys(options).forEach((key) => {
    block.element[key] = options[key];
  })

  return block.element
}

function renderBlock(block){
  resp = block.render()
  if (isPromise(resp)){
    resp.then((content) => {
      block.element.content = !!content ? content : ''
      screen.render()
    })
  } else {
    block.element.content = !!resp ? resp : ''
  }
}

screen.append(placeBlock(dateTime, {
  top: 0,
  left: 0,
  width: 60,
  height: 4
}));

screen.append(placeBlock(homework, {
  top: 4,
  left: 0,
  width: 60,
  height: '95%'
}));

screen.append(placeBlock(hackernews, {
  top: 0,
  left: 61,
  width: 60,
  height: 17
}));

screen.append(placeBlock(email, {
  top: 17,
  left: 61,
  width: 24,
  height: 3
}));

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

var blocks = [dateTime, homework, hackernews, email]

function renderBlocks(){
  blocks.forEach((block) => {
    renderBlock(block);
  })
  screen.render()
}

renderBlocks()
setInterval(renderBlocks, 1000)

screen.render();
