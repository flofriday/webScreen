const fs = require('fs');

// Shared variables and functions
exports.enable = false;
exports.format = 'csv';
exports.csvDevider = ',';
exports.path = 'webScreenData.csv';


exports.write = function(inList)
{
  // Exit if this module should not be used
  if (exports.enable == false) {return;}

  //select the file format
  if (exports.format === 'csv') {writeCSV(inList);}
  else if (exports.format === 'txt') {writeTXT(inList);}
}


// Global variables
var checkedForFile = false;


function checkTime(i)
{
  return (i < 10) ? "0" + i : i;
}

function getHHMM()
{
  var d = new Date();
  return checkTime(d.getHours()) + ':' + checkTime(d.getMinutes());
}

function getDDMMYYYY()
{
  var d = new Date();
  return checkTime(d.getDate()) + '.' + checkTime(d.getMonth() + 1) + '.' + checkTime(d.getFullYear());
}


function writeCSV(inList)
{
  // Get the current time
  var time = getHHMM();

  // Generate the output string
  var output = time;
  for (var i = 0; i < inList.length; i++)
  {
    output += exports.csvDevider + inList[i].value;
  }
  output += '\n';

  // Check if the file was loaded before
  if (checkedForFile === false)
  {
    //if not add the header to the values
    checkedForFile = true;

    // Create the header of the csv file with all names of the values
    var firstLine = "";

    // If the file exitst make a space of 3 lines before the last values
    if (fs.existsSync(exports.path) === true) {firstLine = "\n\n\n"} // Ask the filesystem

    // Generate the custom header
    firstLine += "webScreen Data File" + exports.csvDevider + exports.csvDevider + "Date: " + getDDMMYYYY() + " [DD.MM.YYYY]\nTime";
    for (var i = 0; i < inList.length; i++)
    {
      firstLine += exports.csvDevider + inList[i].name;
    }

    // Append the header at the top of the other output
    output = firstLine + "\n" + output;
  }

  // Add to the file (async)
  fs.appendFile(exports.path, output, (err) => {
    if (err) throw err;
  });
}


function writeTXT(inList)
{
  // Get the current time
  var time = getHHMM();

  // Generate the output string
  var output = time;
  for (var i = 0; i < inList.length; i++)
  {
    output += "\t" + inList[i].value;
  }
  output += '\n';

  // Check if the file was loaded before
  if (checkedForFile === false)
  {
    //if not add the header to the values
    checkedForFile = true;

    // Create the header of the csv file with all names of the values
    var firstLine = "";

    // If the file exitst make a space of 3 lines before the last values
    if (fs.existsSync(exports.path) === true) {firstLine = "\n\n\n"} // Ask the filesystem

    // Generate the custom header
    firstLine += "webScreen Data File" + "\t\t" + "Date: " + getDDMMYYYY() + " [DD.MM.YYYY]\nTime";
    for (var i = 0; i < inList.length; i++)
    {
      firstLine += "\t" + inList[i].name;
    }

    // Append the header at the top of the other output
    output = firstLine + "\n" + output;
  }

  // Add to the file (async)
  fs.appendFile(exports.path, output, (err) => {
    if (err) throw err;
  });
}
