![](https://img.shields.io/badge/Foundry-v0.8.9-informational)

## Importer
* **Author**: Draconas#9000
* **Foundry VTT Compatibility**: 0.8.9
* **DnD4E system compatibility**: 0.2.43

### Description
An importer for Monster Data from Masterplan.  You will need https://github.com/draconas1/masterplan-json-export to export the data, this module provides the importer  

## Installation
* Open the Foundry application and click **"Install Module"** in the **"Addon Modules"** tab.
* Paste the following link: https://raw.githubusercontent.com/draconas1/foundry-4e-tools/main/module.json
* Click "Install"
* Enable it on your game.

## Use
* The GM will get button in the actors tab for "import monsters"
* Paste the JSON from the Masterplan export, make sure the export was for Foundry JSON not Roll20 and click go

### Options
* **Import Into Folders**: The importer will find / create a folder based on the encounter name and put all the imports there
* **Duplicate Checking**: Either no checking, or check (and don't import) if a creature exists with a matching name, or check for matching name, but only in the folder you are importing into.


### Configuration
The folder import and duplicate checking have configuration options that let you specify their default values.  

## Notes
There are probably a lot of bugs, here are some I know about:
1. It still has legacy code and UI for the "todo list" tutorial all over it.
2. Empty folders can be created for empty encounters.  

## Credit
Dan Houston and Dave Barnett both kindly created the SVG art of the 4E power icons for me when I posted a request out to my friends :)