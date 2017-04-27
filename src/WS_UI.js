"use strict"


var blessed = require('blessed');
var opn = require('opn');

// All export function and variables
exports.render = function() { screen.render(); isRenderAllowed = 1;};
exports.destroy = function() { screen.destroy(); isRenderAllowed = 0;};
exports.setItems = function(inputList)
{
  //load the input
  itemList.setItems(inputList);

  // refresh the update time
  var d = new Date();
  menuBarRight.setContent('last update: {' + exports.accentColor + '-bg}' + checkTime(d.getHours()) + ':' + checkTime(d.getMinutes()) + '{' + exports.accentColor + '-bg}')
  if (isRenderAllowed) { screen.render(); }
};
exports.setRefreshCallback = function (cb) { refreshCallback = cb; }; //TODO: Replace with an event
exports.setAppVersion = function(input)
{
  menuBarLeft.setContent('{' + exports.accentColor + '-bg}webScreen{/' + exports.accentColor + '-bg} ' + input);
  if (isRenderAllowed) { screen.render(); }
};
exports.showLoadingIndicator = function(input)
{
  if (input === true) { loadingIndicator.setContent("Loading ..."); }
  else { loadingIndicator.setContent(""); }
  if (isRenderAllowed) { screen.render(); }
}
exports.updateColors = function ()
{
  background.style.bg = exports.backColor;

  menuBar.style.fg = exports.fontColor;
  menuBarLeft.style.fg = exports.fontColor;
  menuBarMiddle.style.fg = exports.fontColor;
  menuBarRight.style.fg = exports.fontColor;

  menuBar.style.bg = exports.backColor;
  menuBarLeft.style.bg = exports.backColor;
  menuBarMiddle.style.bg = exports.backColor;
  menuBarRight.style.bg = exports.backColor;

  itemList.style.fg = exports.fontColor;
  itemList.style.bg = exports.backColor;
  itemList.style.item.fg = exports.fontColor;
  itemList.style.item.bg = exports.backColor;
  itemList.style.border.fg = exports.borderColor;
  itemList.style.border.bg = exports.backColor;
  itemList.style.selected.fg = exports.fontColor;
  itemList.style.selected.bg = exports.accentColor;

  loadingIndicator.style.fg = exports.fontColor;
  loadingIndicator.style.bg = exports.backColor;

  footerLeft.style.fg = exports.fontColor;
  footerLeft.style.bg = exports.backColor;
  footerRight.style.fg = exports.fontColor;
  footerRight.style.bg = exports.backColor;
}
exports.showBorder = function(input)
{
  if (input === true) {itemList.border.type = 'line';}
  else {itemList.border.type = 'bg';}
  if (isRenderAllowed) { screen.render(); }
}


// Some Global variables
var isRenderAllowed = 0;
var refreshCallback = function(){};
exports.fontColor = 'default';
exports.backColor = 'default';
exports.borderColor = 'default';
exports.accentColor = '#009688';


// This function is just to make time in the right format
function checkTime(i)
{
  return (i < 10) ? "0" + i : i;
}


// Create a screen object.
var screen = blessed.screen({
  smartCSR: true
});

screen.title = 'webScreen';


// The background box
var background = blessed.box({
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  style: {
    bg: exports.backColor
  }
});


/*
* MENU BAR
*/

// The background of the menubar
var menuBar = blessed.box({
  top: '0',
  left: 'center',
  width: '100%',
  height: 1,
  tags: true,
  style: {
    inverse: true,
    fg: exports.fontColor,
    bg: exports.backColor
  }
});

// The left part of the menubar
var menuBarLeft = blessed.box({
  top: '0',
  left: 3,
  width: 'shrink',
  height: 1,
  content: '{' + exports.accentColor + '-bg}webScreen{/' + exports.accentColor + '-bg}',
  tags: true,
  style: {
    inverse: true,
    fg: exports.fontColor,
    bg: exports.backColor
  }
});

// The middle part of the menubar
var menuBarMiddle = blessed.list({
  top: '0',
  left: 'center',
  width: 'shrink',
  height: 1,
  content: '',
  tags: true,
  style: {
    inverse: true,
    fg: exports.fontColor,
    bg: exports.backColor
  }
});

// The right part of the menubar
var menuBarRight = blessed.box({
  top: '0',
  right: 3,
  width: 'shrink',
  height: 1,
  content: 'last update: {' + exports.accentColor + '-bg}XX:XX{/' + exports.accentColor + '-bg}',
  tags: true,
  style: {
    inverse: true,
    fg: exports.fontColor,
    bg: exports.backColor
  }
});



/*
* ITEM LIST
*/
var itemList = blessed.list({
  mouse: true,
  keys: true,
  border: 'line',
  width: '100%-4',
  height: '100%-4',
  top: 2,
  left: 'center',
  tags: true,
  invertSelected: true,
  scrollbar: true,
  style: {
    fg: exports.fontColor,
    bg: exports.backColor,
    item: {
      fg: exports.fontColor,
      bg: exports.backColor,
    },
    border: {
      fg: exports.borderColor,
      bg: exports.backColor
    },
    selected: {
      fg: exports.fontColor,
      bg: exports.accentColor
    },
    scrollbar: {
      bg: 'grey',
      fg: 'white'
    }
  },
  scrollbar: {
    ch: ' ',
    track: {
      bg: 'grey',
      fg: 'white'
    }
  }
});


/*
* Loading Inddicator
*/
var loadingIndicator = blessed.box({
  bottom: 1,
  left: 3,
  width: 'shrink',
  height: 1,
  content: '',
  tags: true,
  style: {
    fg: exports.fontColor,
    bg: exports.backColor
  }
});


/*
* Draw the footer
*/

// The left footer
const commands = {
  'esc': 'Quit',
  'down': 'Scroll Down',
  'up': 'Scroll Up',
  'F5': 'Reload'
}
let text = ''
for (const c in commands) {
  const command = commands[c]
  text += `  {inverse}${c}{/inverse} ${command}`
}
const footerLeft = blessed.box({
  width: 'shrink',
  top: '100%-1',
  left: 1,
  tags: true,
  fg: exports.fontColor,
  bg: exports.backColor
})
footerLeft.setContent(text);

// the right footer
const footerRight = blessed.box({
  mouse: true,
  keys: true,
  width: 'shrink',
  top: '100%-1',
  content: 'by flofriday',
  right: 3,
  tags: true,
  fg: exports.fontColor,
  bg: exports.backColor
})


// Append objects to screen
screen.append(background);
screen.append(menuBar);
screen.append(menuBarLeft);
screen.append(menuBarMiddle);
screen.append(menuBarRight);
screen.append(footerLeft);
screen.append(footerRight);
screen.append(itemList);
screen.append(loadingIndicator);


// Focus the itemlist
itemList.focus();


// flofriday clicked
footerRight.on('click', function(data) {
  opn('https://github.com/flofriday/');
});

footerRight.on('mouseover', function(data) {
  footerRight.setContent('lolollllddll');
  if (isRenderAllowed) { screen.render(); }
});
footerRight.on('mouseout', function(data) {
  footerRight.setContent('by flofriday');
  if (isRenderAllowed) { screen.render(); }
});

// Call the function if F5 is pressed
screen.key('f5', function(ch, key) {
  if (isRenderAllowed) { screen.render(); }
  refreshCallback();
});


// Quit webScreen at Escape, or Control-C
screen.key(['escape', 'C-c'], function(ch, key) {
  return process.exit(0);
});
