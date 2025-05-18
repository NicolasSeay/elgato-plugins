import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { EnableMonitor } from "./actions/enable-monitor";
import { DisableMonitor } from "./actions/disable-monitor";
import { SetPrimaryMonitor } from "./actions/set-primary-monitor";

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.INFO);

// Register the increment action.
streamDeck.actions.registerAction(new EnableMonitor());
streamDeck.actions.registerAction(new DisableMonitor());
streamDeck.actions.registerAction(new SetPrimaryMonitor());

// Finally, connect to the Stream Deck.
streamDeck.connect();
