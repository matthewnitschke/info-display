var blessed = require('blessed')
var moment = require('moment')

var screen = blessed.screen({
  warnings: true,
  dockBorders: true
});

var calendar = blessed.box({
  parent: screen,
  padding: 0,
  width: "100%",
  height: "100%"
})

var numWeeks = 4;
var height = 25;
for (var i = 0; i < numWeeks; i ++){
  var week = blessed.box({
    parent: calendar,
    width: "100%",
    height: `${height}%${i < numWeeks-1 ? '+1' : ''}`,
    top: `${height*i}%`,
    border: "line"
  })
  
}


screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.render();
