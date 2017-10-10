var blessed = require('blessed');
var moment = require('moment');
var chalk = require('chalk');
var isPromise = require('is-promise')

var screen = blessed.screen();

var homework = require('./blocks/homework.js')
var dateTime = require('./blocks/clock.js')
var hackernews = require('./blocks/hackernews.js')

function placeBlock(block, options){
  Object.keys(options).forEach((key) => {
    block.element[key] = options[key]
  })

  return block.element
}

function renderBlock(block){
  resp = block.render()
  if (isPromise(resp)){
    resp.then((content) => {
      block.element.content = content
      screen.render()
    })
  } else {
    block.element.content = resp
  }
}

screen.append(placeBlock(dateTime, {
  top: '0%',
  left: '0%',
  width: '25%',
  height: '10%'
}));

screen.append(placeBlock(homework, {
  top: '10%',
  left: '0%',
  width: '25%',
  height: '90%'
}));

screen.append(placeBlock(hackernews, {
  top: '0%',
  left: '26%',
  width: '30%',
  height: '30%'
}))

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

var blocks = [dateTime, homework, hackernews]

function renderBlocks(){
  blocks.forEach((block) => {
    renderBlock(block);
  })
  screen.render()
}

renderBlocks()
setInterval(renderBlocks, 50000)

screen.render();
