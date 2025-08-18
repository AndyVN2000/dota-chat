import 'dotenv/config';
import { WebSocketManager, WebSocketShardEvents, CompressionMethod } from '@discordjs/ws';

import { REST } from '@discordjs/rest';

/**
 * Copypasta based on: https://www.npmjs.com/package/@discordjs/ws
 */

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

const manager = new WebSocketManager({
	token: process.env.DISCORD_TOKEN,
	intents: 0, // for no intents
	rest,
	// uncomment if you have zlib-sync installed and want to use compression
	// compression: CompressionMethod.ZlibSync,

	// alternatively, we support compression using node's native `node:zlib` module:
	// compression: CompressionMethod.ZlibNative,
});

manager.on(WebSocketShardEvents.Dispatch, (event) => {
	// Process gateway events here.
});

await manager.connect();