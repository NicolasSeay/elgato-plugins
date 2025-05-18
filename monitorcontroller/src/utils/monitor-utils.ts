import streamDeck, { DidReceiveSettingsEvent, KeyDownEvent, WillAppearEvent } from "@elgato/streamdeck";
import { exec } from "child_process";
import { createReadStream, readFile, writeFile } from "fs";
import { parse } from 'csv-parse';
import { promisify } from "util";

export class MonitorUtils {
    
    static async onWillAppearUtil(ev: WillAppearEvent): Promise<void> {
    // Use MultiMonitorTool to print monitor info to a csv
		streamDeck.logger.info();
		streamDeck.logger.info("-- Printing monitor info to csv --");
		const execAsync = promisify(exec);
		await execAsync('/utils/MultiMonitorTool.exe /scomma /utils/monitors.csv', {});
		
		// Read the monitor csv data
		streamDeck.logger.info();
		streamDeck.logger.info("-- Parsing monitor info --");
		var monitors = [];
		const parser = createReadStream('/utils/monitors.csv').pipe(parse({delimiter: ','}));
		for await (const row of parser) {
			streamDeck.logger.debug("Row: ", row);
			monitors.push({
				shortMonitorID: row[15],
				name: row[10],
				resolution: row[0],
				isPrimary: row[5] === "Yes"
			} as Monitor);
		}
		monitors.splice(0, 1);
		monitors.forEach(monitor => {
			streamDeck.logger.info(monitor);
		});

		// Check for previously selected monitor
		const readAsync = promisify(readFile);
		var selectedMonitor;
		try {
			await readAsync(`/config/${ev.action.id}.json`, 'utf8').then((data) => {
				streamDeck.logger.debug("Config from file: ", data);
				selectedMonitor = JSON.parse(data).selectedMonitor;
			});
		} catch (e) {
			streamDeck.logger.warn("No existing config file");
		}

		// Set monitor dropdown options?
		ev.action.setSettings({
			monitorList: monitors,
			selectedMonitor: selectedMonitor
		});
    }

    static onDidReceiveSettingsUtil(ev: DidReceiveSettingsEvent<MonitorSettings>): Promise<void> | void {
        // Persist selection & action id to config file
        writeFile(`/config/${ev.action.id}.json`, `{ "selectedMonitor": "${ev.payload.settings.selectedMonitor}" }`, (err) => {
            if (err) {
                streamDeck.logger.error(err);
                return;
            }
            streamDeck.logger.info("Data successfully written");
        });
    }

    static async onKeyDownUtil(ev: KeyDownEvent<MonitorSettings>, action: string): Promise<void> {
        exec(`/utils/MultiMonitorTool.exe /${action} ${ev.payload.settings.selectedMonitor}`,
            {},
            function(err, data) {
            streamDeck.logger.error(err)
            streamDeck.logger.info(data.toString());
        });
        streamDeck.logger.info(`-- ${action} command completed --`);
    }
}

export type MonitorSettings = {
	selectedMonitor: string,
	monitorList: Monitor[],
};

export type Monitor = {
	shortMonitorID: number,
	name: string,
	resolution: string,
	isPrimary: boolean
};
