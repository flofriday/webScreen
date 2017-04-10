"use strict"

const req = require("tinyreq");
const cheerio = require("cheerio");


/*
* An url object is defined by its url and the html you will get when you load
* the url.
*/
function urlObject (url, value)
{
  this.url = url;
  this.value = value;
  this.error = false;
  this.loadValue = function(cb){
    urlsAreLoading++;
    req(this.url, (err, body) => {
      //check for errors
      if (err) {this.error = true; this.value = err}
      else {this.error = false; this.value = body;}
      urlsAreLoading--;
      if (typeof cb === "function"){cb();}
    });
  }
}


var urlList = []; // In this list are all urls needed
var urlsAreLoading = 0; // This value tells you how many urls are loading at the moment
var inUse = false; // if the libary is doing something at all

/*
* This function simply deletes all html from every element in the urlList
*/
function clearUrlList()
{
  urlList.splice(0,urlList.length);
}


/*
* This function requests the html of every item in the urllist and saves the
* html in .value.
* Moreover, when every item loaded its list it will call onUrlListLoaded().
*/
function loadUrlList(cb)
{
  for (var i = 0; i < urlList.length; i++)
  {
    urlList[i].loadValue(function () {
      if (urlsAreLoading === 0){if (typeof cb === "function"){cb();}}
    });
  }
}


/*
* Thats how every item is defined
*/
function itemObject(name, url, selector, value)
{
  this.name = name;
  this.url = url;
  this.selector = selector;
  this.value = value;
  this.loadValue = function()
  {
    // 1. Select the right url object and get the html from it
    var body = null;
    for (var i = 0; i < urlList.length; i++)
    {
      if (this.url === urlList[i].url)
      {
        if (urlList[i].error === true){this.value = urlList[i].value; return;}  //check for errors
        body = urlList[i].value;
        break;
      }
    }

    // 2. Parse the html and extract the right value
    let $ = cheerio.load(body);
    this.value = $(this.selector).text().trim();
  }
}


var itemList = [];


/*
* every Item loads its value
*/
function loadItemList()
{
  for (var i = 0; i < itemList.length; i++)
  {
    itemList[i].loadValue();
  }
}


/*
* This function simply clears the whole itemList
*/
function clearItemlList()
{
  itemList.splice(0,itemList.length);
}


/*
* This code generates the urlList from the items in the itemList
*/
function generateUrlList()
{
  clearUrlList();

  for (var i = 0; i < itemList.length; i++)
  {
    var found = 0;
    for (var j = 0; j < urlList.length; j++)
    {
      if (itemList[i].url === urlList[j].url)
      {
        found = 1;
        break;
      }
    }

    if (found === 0)
    {
      urlList.push(new urlObject(itemList[i].url, null));
    }
  }
}


/*
* Define all functions to export
*/

// This function adds a new item
exports.addItem = function(name, url, selector)
{
  itemList.push(new itemObject (name, url, selector, null));
  generateUrlList();
};

// This function deletes all items
exports.clearItems = function() {clearItemlList(); clearUrlList();};

// This function calls the callback function if all values are loaded
// TODO: Replace with Event
exports.setItemsLoadedCallback = function (cb) {itemsLoadedCallback = cb};
var itemsLoadedCallback = function () {};

// This code will start loading the values
exports.loadItems = function ()
{
  if (inUse === false)
  {
    inUse = true;
    loadUrlList(function()
    {
      loadItemList();
      itemsLoadedCallback(itemList);
      inUse = false;
    });
  }
};
