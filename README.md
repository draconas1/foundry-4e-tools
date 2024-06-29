![](https://img.shields.io/badge/Foundry-v12-informational)
# D&D 4E Tools for Foundry VTT
A collection of tools and utilities for improving QoL running 4E in foundry VTT, distributed as a free module.

This requires the D&D 4E setting: https://github.com/EndlesNights/dnd4eBeta

* **Author**: Draconas#9000
* **Foundry VTT Compatibility**: 12.0+
* **DnD4E system compatibility**: 0.5.1+

## Installation
* Open the Foundry application and click **"Install Module"** in the **"Addon Modules"** tab.
* Search for **"Drac"** and you will see **"Dracs 4E tools for Foundry VTT"**.  
* Click the install button
* Enable it on your game.

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

### Update Monster Knowledge Features
For if you are reskinning / theming a monster you have imported from masterplan.  This will update the Monster Knowledge (medium) and Monster knowledge (hard) features.  It will change the base info (the stuff you get in Monster Knowledge Medium) to match what is in the character sheet, and will make an effort to replace the monsters name in the power text with the new one (but this is an extremely ineact science).  It does not update the power descriptions at the moment.  

This is accessed as a context menu item on NPC actors.  

## Compendiums
### Drac's Items
#### MM3 Monster Stats Setter
Add this item to an actor and then roll the item to trigger the attached macro.  The macro will set the HP/defences/other stuff as per MM3 on a business card based on the monsters level and role.

For further details see the description in the item

### Drac's Treasure
Some roll tables for gems and art objects that I wrote to be more interesting than the ones in the DMG.

### Drac's Macros
A selection of macros for working with things in 4E.  Macros all have comments at the start explaining what they are doing.  

#### Required Knowledge
Private messages the GM with the DC's of monster knowledge checks based on the monsters level.  Also attempts to guess what skill is needed based on the monsters origin, type and other types.  

Designed for use with my imported monsters that have the medium and hard knowledge check info ready and waiting as features that you can dump into the chat.  

#### Toggle Mark
A demo macro that toggles on a mark status effect on all selected tokens.  Easy to customise to your most common status effects.  

#### Toggle Token Light
Makes the selected tokens give off light and toggles the "torch" status effect to match.  Brings up a menu with the most common 4E light sources.  

## Addins
Compatibility for 4E for the following modules:
* Auto Complete Inline Properties: https://github.com/ghost-fvtt/FVTT-Autocomplete-Inline-Properties 
* Drag Ruler: https://github.com/manuelVo/foundryvtt-drag-ruler

# Thanks
Dan Houston and Dave Barnett both kindly created the SVG art of the 4E power icons for me when I posted a request out to my friends :)
