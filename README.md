# Summary

Elgato Streamdeck plugin that offers a handful of multi monitor actions. I have batch scripts that I run locally to enable, set as primary, and open games on the monitor I use in my sim racing setup.
I realized there weren't any existing Elgato plugins that offer this specific tool so I figured it would be helpful to turn convert this to a plugin myself and offer it on the marketplace.

Hopefully this saves you time and headaches!

# Usage

## In Stream Deck

Steps if you have already installed this from the Elgato marketplace and are setting it up in the Stream Deck app.

1. I personally use and recommend that others use a Multi-Action to chain these actions together. I enable my 3rd monitor that I use for racing, and then set it as primary. So once I open a game it will automatically open to that display and with that monitor's ultrawide resolution.

![image](https://github.com/user-attachments/assets/61076faa-3bf3-417c-a96c-d4469cb78f21)

2. All of the actions provided in this plugin require the monitor's Short Monitor ID (this only needs to be done once!):
    - This is retrieved using the [MultiMonitorTool](https://www.nirsoft.net/utils/multi_monitor_tool.html)
    - Once you download the tool, unzip, and run it, you can see a list of all your monitors
    - Right click on the monitor you're trying to modify (enable, disable, set as primary)
    - Select Properties
    - Copy the Short Monitor ID value and paste it into the corresponding field in Stream Deck
    - **Note**: I did NOT make this tool, and all credit for it goes to the author, Nir Sofer
  
   ![image](https://github.com/user-attachments/assets/1e28c663-5913-41a6-a859-d650840329a8)

**Note**: I add a delay between the actions because it can take a few seconds for Windows to finish enabling/disabling the display

## Locally

Steps for running/testing locally.

Requirements:
- Node v20
- VSCode (recommended)

Steps:
1. Clone repo and navigate to /monitorcontroller folder
2. Run ```npm clean install``` the first time you set this up
3. Run ```npm run watch```
   - This will hot reload any changes you make, after saving any .ts file
   - Plugin actions will appear in your live Stream Deck app and you can test them
     
        ![image](https://github.com/user-attachments/assets/6aa0a5d5-a1f4-47c6-8483-1d98d3add910)


# Author

Nico Seay

(Nico75 on Elgato marketplace)
