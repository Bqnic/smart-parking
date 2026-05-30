const express = require("express");
const cors = require("cors");

const startMqtt = require("./mqtt-subscriber.js");
const startWebsockets = require("./ws.js");

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);

app.use(cors());

// IoT platform to backend connection
const mqttClient = startMqtt(
	"intstv26_parking/out/testFERparking",
	onParkingStatusMessage,
);
// Backend to frontend connection
const wss = startWebsockets(server);

app.post("/reserve/:id", (req, res) => {
	const parkingId = req.params.id;

	const payload = JSON.stringify({
		contentNodes: [
			{
				source: {
					resource: `FER_parking_spot_${parkingId}_status`,
				},
				value: 1, // reserve
				time: new Date().toISOString(),
			},
		],
	});

	mqttClient.publish("intstv26_parking/in/testFERparking", payload, (err) => {
		if (err) {
			console.error("Publish error:", err);
		} else {
			console.log("Published:", payload);
		}
	});

	res.json({
		success: true,
		reserved: parkingId,
	});
});

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

	const id = parts[3];
	const field = parts[4]; // status | ramp | distance

	const result = {
		id,
		status: undefined,
		ramp: undefined,
		distance: undefined,
		time: node.time,
	};

	result[field] = node.value;

	return result;
}

server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
