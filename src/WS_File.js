const fs = require('fs')

// Shared variables and functions
exports.enable = false
exports.format = 'csv'
exports.csvDevider = ','
exports.dateFormat = 'DMY'
exports.dateSeparator = '.'
exports.webScreenVersion = ''
exports.path = 'webScreenData.csv'

exports.write = function (inList) {
  // Exit if this module should not be used
  if (exports.enable == false) { return }

  // select the file format
  if (exports.format === 'csv') { writeCSV(inList) } else if (exports.format === 'txt') { writeTXT(inList) } else if (exports.format === 'json') { writeJSON(inList) }
}

// Global variables
var checkedForFile = false

function checkTime (i) {
  return (i < 10) ? '0' + i : i
}

function getTime () {
  var d = new Date()
  return checkTime(d.getHours()) + ':' + checkTime(d.getMinutes())
}

function getDate () {
  var d = new Date()
  var output = ''

  for (var i = 0; i < 3; i++) {
    if (exports.dateFormat.charAt(i) == 'D') { output += checkTime(d.getDate()) } else if (exports.dateFormat.charAt(i) == 'M') { output += checkTime(d.getMonth() + 1) } else if (exports.dateFormat.charAt(i) == 'Y') { output += checkTime(d.getFullYear()) }
    if (i < 2) { output += exports.dateSeparator }
  }

  return output
  // return checkTime(d.getDate()) + exports.dateSeparator + checkTime(d.getMonth() + 1) + exports.dateSeparator + checkTime(d.getFullYear());
}

function writeCSV (inList) {
  // Get the current time
  var output = getDate() + ' ' + getTime()

  // Generate the output string
  for (var i = 0; i < inList.length; i++) {
    output += exports.csvDevider + inList[i].value
  }
  output += '\n'

  // Check if the file was loaded before
  if (checkedForFile === false) {
    // if not add the header to the values
    checkedForFile = true

    // Create the header of the csv file with all names of the values
    var firstLine = ''

    // If the file exitst make a space of 3 lines before the last values
    if (fs.existsSync(exports.path) === true) { firstLine = '\n\n\n' } // Ask the filesystem

    // Generate the custom header
    firstLine += 'webScreen Data File' + exports.csvDevider + 'webScreen Version: ' + exports.webScreenVersion + '\nTime'
    for (var i = 0; i < inList.length; i++) {
      firstLine += exports.csvDevider + inList[i].name
    }

    // Append the header at the top of the other output
    output = firstLine + '\n' + output
  }

  // Add to the file (async)
  fs.appendFile(exports.path, output, (err) => {
    if (err) throw err
  })
}

function writeTXT (inList) {
  // Get the current time
  var output = getDate() + ' ' + getTime()

  // Generate the output string
  for (var i = 0; i < inList.length; i++) {
    output += '\t' + inList[i].value
  }
  output += '\n'

  // Check if the file was loaded before
  if (checkedForFile === false) {
    // if not add the header to the values
    checkedForFile = true

    // Create the header of the csv file with all names of the values
    var firstLine = ''

    // If the file exitst make a space of 3 lines before the last values
    if (fs.existsSync(exports.path) === true) { firstLine = '\n\n\n' } // Ask the filesystem

    // Generate the custom header
    firstLine += 'webScreen Data File' + '\t' + '+ webScreen Version: ' + exports.webScreenVersion + '\nTime'
    for (var i = 0; i < inList.length; i++) {
      firstLine += '\t' + inList[i].name
    }

    // Append the header at the top of the other output
    output = firstLine + '\n' + output
  }

  // Add to the file (async)
  fs.appendFile(exports.path, output, (err) => {
    if (err) throw err
  })
}

function writeJSON (inList) {
  if (checkedForFile === false && fs.existsSync(exports.path) === false) {
    var obj = {
      table: []
    }
    var json = JSON.stringify(obj)
    fs.writeFileSync(exports.path, json, 'utf8')
  }

  fs.readFile(exports.path, function (err, content) {
    if (err) throw err
    var parseJson = JSON.parse(content)

    var newOutput = {}
    newOutput['time'] = new Date().getTime()
    for (var i = 0; i < inList.length; i++) {
      newOutput[inList[i].name] = inList[i].value
    }

    parseJson.table.push(newOutput)

    fs.writeFile(exports.path, JSON.stringify(parseJson), function (err) {
      if (err) throw err
    })
  })
}
