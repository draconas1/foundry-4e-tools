![](https://img.shields.io/badge/Foundry-v0.8.9-informational)

## Importer
* **Author**: Draconas#9000
* **Foundry VTT Compatibility**: 0.8.9
* **DnD4E system compatibility**: 0.2.38

### Description
An importer for Monster Data from Masterplan.  You will need https://github.com/draconas1/masterplan-json-export to export the data, this module provides the importer  

## Installation
* Open the Foundry application and click **"Install System"** in the **"Addon Modules"** tab.
* Paste the following link: https://github.com/draconas1/foundry-4e-tools/blob/main/module.json
* Click "Install"
* Enable it on your game.

# NOTE IT IS CURRENTLY IN DEV!

## Use

It is currently extremely rough and ready.  

An import button will appear on the actors/items/compendium tab of the chat.  It only imports NPC's regardless of where you click it.

When the popup box appears paste the json from the masterplan in there and click import.

## Notes
There are probably a lot of bugs, here are some I know about:
1. It still has legacy code and UI for the "todo list" tutorial all over it. 
2. No checking if the actor already exists
3. Power range calculation is still a bit iffy based on the quality of the Masterplan file
4. You need version 38 of dnd4e to get power range of "melee", which isn't released yet