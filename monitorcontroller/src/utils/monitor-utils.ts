import streamDeck, { DidReceiveSettingsEvent, KeyDownEvent, WillAppearEvent } from "@elgato/streamdeck";
import { exec } from "child_process";
import { createReadStream, readFile, writeFile } from "fs";
import { parse } from 'csv-parse';
import { promisify } from "util";

export class MonitorUtils {
    
    static async onWillAppearUtil(ev: WillAppearEvent): Promise<void> {
		// Check for previously selected monitor
		const readAsync = promisify(readFile);
		var selectedMonitor;
		try {
			await readAsync(`config\\settings\\${ev.action.id}.json`, 'utf8').then((data) => {
				streamDeck.logger.debug("Config from file: ", data);
				selectedMonitor = JSON.parse(data).selectedMonitor;
			});
		} catch (e) {
			streamDeck.logger.warn("No existing config file. Need user to provide selected monitor ID.");
		}

		// Set the selectedMonitor value
		ev.action.setSettings({
			selectedMonitor: selectedMonitor
		});
    }

    static onDidReceiveSettingsUtil(ev: DidReceiveSettingsEvent<MonitorSettings>): Promise<void> | void {
        // Persist settings to config file so selected monitor can be saved between sessions
        writeFile(`config\\settings\\${ev.action.id}.json`,
			`{ "selectedMonitor": "${ev.payload.settings.selectedMonitor}" }`,
			(err) => {
				if (err) {
					streamDeck.logger.error(err);
					return;
				}
				streamDeck.logger.info("Data successfully written");
        	});
    }

    static async onKeyDownUtil(ev: KeyDownEvent<MonitorSettings>, action: string): Promise<void> {
		// Execute the given MultiMonitorTool command
        exec(`utils\\MultiMonitorTool.exe /${action} ${ev.payload.settings.selectedMonitor}`,
            {},
            (err) => {
				if (err) {
					streamDeck.logger.error(err);
				}
			});
        streamDeck.logger.info(`-- ${action} command completed --`);
    }
}

export type MonitorSettings = {
	selectedMonitor: string,
};

export type Monitor = {
	shortMonitorID: string,
};
