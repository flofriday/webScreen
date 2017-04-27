'use strict'

// include some libaries
var app = require('../package.json')
var config = require('../config.json')
var itemList = require('../items.json').itemlist
var ui = require('./WS_UI')
var scrap = require('./WS_Scrap')
var file = require('./WS_File')

// configure the UI
ui.fontColor = config.interface.fontcolor
ui.backColor = config.interface.backgroundcolor
ui.borderColor = config.interface.bordercolor
ui.accentColor = config.interface.accentcolor
ui.updateColors()
ui.showBorder(config.interface.showborder)
ui.setAppVersion('v' + app.version)
ui.setItems(['webScreen by flofriday', app.description, '', 'Loading ...'])
ui.render()

// configure the data file
file.enable = config.datafile.enable
file.format = config.datafile.format
file.csvDevider = config.datafile.csvdevider
file.path = config.datafile.path
file.webScreenVersion = app.version
file.dateFormat = config.datafile.dateformat
file.dateSeparator = config.datafile.dateseparator

// set up the scrap libary
for (var i = 0; i < itemList.length; i++) {
  scrap.addItem(itemList[i].name, itemList[i].url, itemList[i].selector)
}

// show the values in the UI when they are loaded
scrap.setItemsLoadedCallback(function (inList) {
  // update the user interface
  var uiList = []
  for (var i = 0; i < inList.length; i++) {
    uiList.push(inList[i].name + ': ' + inList[i].value)
  }
  ui.setItems(uiList)
  ui.showLoadingIndicator(false)

  // writes to the file
  file.write(inList)
})

// reload the values if F5 is pressed
ui.setRefreshCallback(function () {
  ui.showLoadingIndicator(true)
  scrap.loadItems()
})

// The values reload automatically every minute
ui.showLoadingIndicator(true)
scrap.loadItems()
setInterval(function () {
  ui.showLoadingIndicator(true)
  scrap.loadItems()
}, config.reloadtime * 1000)
