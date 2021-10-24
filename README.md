![](https://img.shields.io/badge/Foundry-v0.8.9-informational)
# D&D 4E Tools for Foundry VTT
A collection of tools and utilities for improving QoL running 4E in foundry VTT, distributed as a free module.

This requires the D&D 4E setting: https://github.com/EndlesNights/dnd4eBeta

* **Author**: Draconas#9000
* **Foundry VTT Compatibility**: 0.8.9
* **DnD4E system compatibility**: 0.2.43

## Installation
* Open the Foundry application and click **"Install Module"** in the **"Addon Modules"** tab.
* Paste the following link: https://raw.githubusercontent.com/draconas1/foundry-4e-tools/main/module.json
* Click "Install"
* Enable it on your game.
* 

## Masterplan Importer
An importer for Monster Data from Masterplan for D&D 4E.  
You will need https://github.com/draconas1/masterplan-json-export to export the data, this module provides the importer.

### Use
* The GM will get button in the actors tab for "import monsters"
* Paste the JSON from the Masterplan export, make sure the export was for Foundry JSON not Roll20 and click go

#### Options
* **Import Into Folders**: The importer will find / create a folder based on the encounter name and put all the imports there
* **Duplicate Checking**: Either no checking, or check (and don't import) if a creature exists with a matching name, or check for matching name, but only in the folder you are importing into.

#### Configuration
The folder import and duplicate checking have configuration options that let you specify their default values.  

### Addons & Compatibility
* Prototype tokens will automatically get square auras compatible with [Token Auras](https://foundryvtt.com/packages/token-auras)

## Tools
### Auto-Bloodied & Dead 

#### Use
* Tokens will automatically gain a big bloodied status icon when reduced to bloodied value
* NPC's will automatically gain a dead status icon and be set as defeated in the combat tracker when reduced to 0 HP.
* PC's will automatically gain a dying status icon when reduced to 0 HP
* PC's will automatically gain a dead status icon and be set as defeated in the combat tracker when reduced to -bloodied HP.

Gaining HP will set them back to the relevant status and undefeat them in combat tracker.

#### Configuration
There are configuration values for automatically setting bloodied and automatically setting the various dead states.

### Replace Dead Status Icon
I found the dead status icon hard to see in some tokens.  There is now a configuration option that replaces it with a big red skull and crossbones.

## Data
Some compendiums of [4th Edition System Reference Document](http://weirdzine.com/wp-content/uploads/2015/07/4E_SRD-1.pdf) compliant data.
* Weapons
* Armour

### Addons & Compatibility
* Compendiums are arranged using [Compendium Folders](https://foundryvtt.com/packages/compendium-folders)

# Thanks
Dan Houston and Dave Barnett both kindly created the SVG art of the 4E power icons for me when I posted a request out to my friends :)