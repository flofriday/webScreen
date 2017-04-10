# config.json
This file is used to configure the behavior and look of webScreen.

## global
* **reloadtime** - The time in seconds until it will automatically reload.

## interface
Colors can be the names of any of the 16 basic terminal colors, along with hex values (e.g. #ff0000). Colors can also be set to 'default' in which case they will use the terminal default colors.
* **fontcolor** - Color for the font.
* **bordercolor** - Color for the background.
* **accentcolor** - Color for the selected item and for the menu bar at the top.
* **showborder** - If a border should be drawn around the downloaded values. If the interface looks messed up you should enter here `false`.

## datafile
* **enable** - If the downloaded values should be saved in a file or not. 
* **path** - The path and filename.
* **format** - In which format the values should be saved. Currently `txt` and `csv` are supported.
* **csvdevider** - If the format is `csv` you can enter here a character which will be used to divide the single values from each other.