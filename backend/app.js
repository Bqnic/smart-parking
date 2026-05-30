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
 * On receiving message from MQTT broker, send message via WebSockets to client.
 * @param {string} message
 */
function onParkingStatusMessage(message) {
	const data = JSON.parse(message);

	const cleanedData = {
		resource: data.contentNodes[0].source.resource,
		value: data.contentNodes[0].value,
		time: data.contentNodes[0].time,
	};

	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify(cleanedData));
		}
	});
}
