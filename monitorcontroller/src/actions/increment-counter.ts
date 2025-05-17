import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { exec } from "child_process";
import { createReadStream, readFile, writeFile } from "fs";
import { parse } from 'csv-parse';
import { promisify } from "util";

/**
 * An example action class that displays a count that increments by one each time the button is pressed.
 */
@action({ UUID: "com.nico75.monitorcontroller.enable_monitor" })
export class EnableMonitor extends SingletonAction<MonitorSettings> {

	override async onWillAppear(ev: WillAppearEvent): Promise<void> {
		// Use MultiMonitorTool to print monitor info to a csv
		streamDeck.logger.info();
		streamDeck.logger.info("--PRINTING MONITOR INFO TO CSV--");
		const execAsync = promisify(exec);
		await execAsync('MultiMonitorTool.exe /scomma monitors.csv', {});
		
		// Read the monitor csv data
		streamDeck.logger.info();
		streamDeck.logger.info("--PARSING MONITOR INFO--");
		var monitors = [];
		const parser = createReadStream('monitors.csv').pipe(parse({delimiter: ','}));
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
			await readAsync(`${ev.action.id}.json`, 'utf8').then((data) => {
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

	override onDidReceiveSettings(ev: DidReceiveSettingsEvent<MonitorSettings>): Promise<void> | void {
		// Persist selection & action id to config file
		writeFile(`${ev.action.id}.json`, `{ "selectedMonitor": "${ev.payload.settings.selectedMonitor}" }`, (err) => {
			if (err) {
				streamDeck.logger.error(err);
				return;
			}
			streamDeck.logger.info('Data successfully written');
		});
	}

	override async onKeyDown(ev: KeyDownEvent<MonitorSettings>): Promise<void> {
		streamDeck.logger.info();
		streamDeck.logger.info("INITIATION ACTION");
		
		streamDeck.logger.info("selected monitor: ", (await ev.action.getSettings()).selectedMonitor);
		const state = ev.payload.settings;
		var selectedMonitorID;
		state.monitorList.forEach(monitor => {
			if (monitor.name.includes(state.selectedMonitor)) {
				selectedMonitorID = monitor.shortMonitorID;
			}
		});
		streamDeck.logger.info("Selected monitor short ID: ", selectedMonitorID);


		exec('MultiMonitorTool.exe /EnableAtPosition "MONITOR\\SAM711A\\{4d36e96e-e325-11ce-bfc1-08002be10318}\\0003" 5120 0',
			{},
			function(err, data) {
			streamDeck.logger.error(err)
			streamDeck.logger.info(data.toString());
		});
	}
}

/**
 * Settings for {@link EnableMonitor}.
 */
type MonitorSettings = {
	selectedMonitor: string,
	monitorList: Monitor[],
};

type Monitor = {
	shortMonitorID: number,
	name: string,
	resolution: string,
	isPrimary: boolean
};
