import { action, DidReceiveSettingsEvent, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { MonitorSettings, MonitorUtils } from "../utils/monitor-utils";


@action({ UUID: "com.nico75.monitorcontroller.set_primary_monitor" })
export class SetPrimaryMonitor extends SingletonAction<MonitorSettings> {

	override async onWillAppear(ev: WillAppearEvent): Promise<void> {
		MonitorUtils.onWillAppearUtil(ev);
	}

	override onDidReceiveSettings(ev: DidReceiveSettingsEvent<MonitorSettings>): Promise<void> | void {
		MonitorUtils.onDidReceiveSettingsUtil(ev);
	}

	override async onKeyDown(ev: KeyDownEvent<MonitorSettings>): Promise<void> {
		MonitorUtils.onKeyDownUtil(ev, 'SetPrimary');
	}
	
}