const mqtt = require("mqtt");

const mqttClient = mqtt.connect({
	host: "djx.entlab.hr",
	port: 8883,
	protocol: "mqtt",
	username: process.env.MQTT_USERNAME,
	password: process.env.MQTT_PASSWORD,
});

// only 001 active for now
const PARKINGS = ["001"];

const RESOURCES = ["status", "ramp", "distance"];

function randomFrom(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function generateValue(resource) {
	switch (resource) {
		case "status":
			return Math.floor(Math.random() * 3); // 0,1,2
		case "ramp":
			return Math.floor(Math.random() * 2); // 0,1
		case "distance":
			return Math.floor(Math.random() * 200); // sensor distance
		default:
			return 0;
	}
}

function buildPayload() {
	const parkingId = randomFrom(PARKINGS);
	const resource = randomFrom(RESOURCES);

	return JSON.stringify({
		contentNodes: [
			{
				source: {
					resource: `FER_parking_spot_${parkingId}_${resource}`,
				},
				value: generateValue(resource),
				time: new Date().toISOString(),
			},
		],
	});
}

// publish every interval seconds
const interval = 1;
setInterval(() => {
	const payload = buildPayload();

	mqttClient.publish("intstv26_parking/in/testFERparking", payload, (err) => {
		if (err) {
			console.error("Publish error:", err);
		} else {
			console.log("Published:", payload);
		}
	});
}, interval * 1000);
