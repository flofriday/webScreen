# items.json
This file is used to select which values should be downloaded. You can add as many values as you want.
#### name
This is the name which will be displayed as a prefix for the downloaded value. You **can** use a Name multiple times.

#### url
The url of the website.

#### selector
An element-selector in the jQuery format.

## example
```json
{
  "itemlist":[

    {
      "name": "Youtube Title",
      "url": "https://www.youtube.com/watch?v=5bA7nrdVEqE",
      "selector": "#eow-title"
    },

    {
      "name": "Youtube Views",
      "url": "https://www.youtube.com/watch?v=5bA7nrdVEqE",
      "selector": "#watch7-views-info > div.watch-view-count"
    },

    {
      "name": "Youtube Artist",
      "url": "https://www.youtube.com/watch?v=5bA7nrdVEqE",
      "selector": "#watch7-user-header > div > a"
    }

  ]
}
```
