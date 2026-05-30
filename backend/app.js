const express = require("express");

const startMqtt = require("./mqtt-subscriber.js");
const startWebsockets = require("./ws.js");

const app = express();
const port = 3000;

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

// IoT platform to backend connection
startMqtt("intstv26_parking/out/testFERparking", onParkingStatusMessage);
// Backend to frontend connection
const wss = startWebsockets(8080);

/**
 * On receiving message from MQTT broker, send message via WebSockets to clients.
 * @param {string} message
 */
function onParkingStatusMessage(message) {
	const data = JSON.parse(message);

	const cleanedParkingData = processParkingMessage(data);

	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify(cleanedParkingData));
		}
	});
}

/**
 * Converts single MQTT node into structured parking update
 * @param {object} data - JSON parsed MQTT message
 */
function processParkingMessage(data) {
	const node = data.contentNodes?.[0];

	if (!node || !node.source?.resource) {
		return null;
	}

	const resource = node.source.resource;

	// expected format:
	// FER_parking_spot_001_status
	const parts = resource.split("_");

	// safety check
	if (parts.length < 5) {
		return null;
	}

	const parking_spot = parts[3];
	const field = parts[4]; // status | ramp | distance

	const result = {
		parking_spot,
		status: undefined,
		ramp: undefined,
		distance: undefined,
		time: node.time,
	};

	result[field] = node.value;

	return result;
}
