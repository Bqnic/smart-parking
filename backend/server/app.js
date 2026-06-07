const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

const startMqtt = require("./mqtt-subscriber.js");
const startWebsockets = require("./ws.js");

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.use(cors());

// IoT platform to backend connection
const mqttClient = startMqtt("intstv26_parking/out/+", onParkingStatusMessage);
// Backend to frontend connection
const wss = startWebsockets(server);

const PARKINGS = {
  FER: [
    "001",
    "002",
    "003",
    "004",
    "005",
    "006",
    "007",
    "008",
    "009",
    "010",
    "011",
    "012",
    "013",
    "014",
    "015",
    "016",
    "017",
    "018",
  ],
  Arena_Centar: [
    "001",
    "002",
    "003",
    "004",
    "006",
    "007",
    "008",
    "009",
    "010",
    "011",
    "012",
    "013",
    "014",
    "015",
    "016",
    "017",
    "018",
  ],
};

app.get("/parking-state", async (req, res) => {
  try {
    const spotPromises = [];

    for (const [location, ids] of Object.entries(PARKINGS)) {
      for (const id of ids) {
        spotPromises.push(
          (async () => {
            const statusResource = `${location}_parking_spot_${id}_status`;

            const rampResource = `${location}_parking_spot_${id}_ramp`;

            const [status, ramp] = await Promise.all([
              getLatestResource(statusResource),
              getLatestResource(rampResource),
            ]);

            return {
              location,
              id,
              status: status ?? 0,
              ramp: ramp ?? 0,
              distance: 0,
            };
          })(),
        );
      }
    }

    const spots = await Promise.all(spotPromises);

    res.json(spots);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed loading parking state",
    });
  }
});

app.get("/analytics/peak-hours/:location", async (req, res) => {
  try {
    const location = req.params.location;

    const ids = PARKINGS[location];

    if (!ids) {
      return res.status(404).json({
        error: "Unknown parking location",
      });
    }

    const hourlyStats = {};

    for (let h = 0; h < 24; h++) {
      hourlyStats[h] = {
        occupiedEvents: 0,
      };
    }

    const historyPromises = [];

    for (const id of ids) {
      const resource = `${location}_parking_spot_${id}_status`;

      historyPromises.push(getResourceHistory(resource));
    }

    const allHistories = await Promise.all(historyPromises);

    for (const history of allHistories) {
      for (const node of history) {
        if (node.value !== 2) {
          continue;
        }

        const hour = new Date(node.time).getHours();

        hourlyStats[hour].occupiedEvents++;
      }
    }

    const result = Object.entries(hourlyStats)
      .map(([hour, stats]) => ({
        hour: Number(hour),
        occupiedEvents: stats.occupiedEvents,
      }))
      .filter((x) => x.occupiedEvents >= 0)
      .sort((a, b) => b.occupiedEvents - a.occupiedEvents)
      .slice(0, 3);

    res.json(result);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed loading",
    });
  }
});

app.post("/reserve/:location/:id", (req, res) => {
  const parkingId = req.params.id;
  const parkingLocation = req.params.location;

  let payload = JSON.stringify({
    contentNodes: [
      {
        source: {
          resource: `${parkingLocation}_parking_spot_${parkingId}_status`,
        },
        value: 1, // reserve
        time: new Date().toISOString(),
      },
    ],
  });

  mqttClient.publish(
    `intstv26_parking/in/${parkingLocation}_parking`,
    payload,
    (err) => {
      if (err) {
        console.error("Publish error:", err);
      } else {
        console.log("Published:", payload);
      }
    },
  );

  payload = JSON.stringify({
    contentNodes: [
      {
        source: {
          resource: `${parkingLocation}_parking_spot_${parkingId}_ramp`,
        },
        value: 1, // ramp
        time: new Date().toISOString(),
      },
    ],
  });

  mqttClient.publish(
    `intstv26_parking/in/${parkingLocation}_parking`,
    payload,
    (err) => {
      if (err) {
        console.error("Publish error:", err);
      } else {
        console.log("Published:", payload);
      }
    },
  );

  res.json({
    success: true,
    reserved: parkingId,
  });
});

app.post("/cancel/:location/:id", (req, res) => {
  const parkingId = req.params.id;
  const parkingLocation = req.params.location;

  let payload = JSON.stringify({
    contentNodes: [
      {
        source: {
          resource: `${parkingLocation}_parking_spot_${parkingId}_status`,
        },
        value: 0, // free
        time: new Date().toISOString(),
      },
    ],
  });

  mqttClient.publish(
    `intstv26_parking/in/${parkingLocation}_parking`,
    payload,
    (err) => {
      if (err) {
        console.error("Publish error:", err);
      } else {
        console.log("Published:", payload);
      }
    },
  );

  payload = JSON.stringify({
    contentNodes: [
      {
        source: {
          resource: `${parkingLocation}_parking_spot_${parkingId}_ramp`,
        },
        value: 0, // ramp
        time: new Date().toISOString(),
      },
    ],
  });

  mqttClient.publish(
    `intstv26_parking/in/${parkingLocation}_parking`,
    payload,
    (err) => {
      if (err) {
        console.error("Publish error:", err);
      } else {
        console.log("Published:", payload);
      }
    },
  );

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

  if (!cleanedParkingData) {
    return;
  }

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(cleanedParkingData));
    }
    console.log(JSON.stringify(cleanedParkingData));
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
  const parts = resource.split("_");

  const parkingIndex = parts.indexOf("parking");

  if (parkingIndex === -1 || parkingIndex + 2 >= parts.length) {
    return null;
  }

  // expected before "parking"
  const location = parts.slice(0, parkingIndex).join("_");

  // expected after "parking":
  const id = parts[parkingIndex + 2]; // "001"
  const field = parts[parkingIndex + 3]; // status | ramp | distance

  const result = {
    location,
    id,
    status: undefined,
    ramp: undefined,
    time: node.time,
  };

  if (field) {
    result[field] = node.value;
  }

  return result;
}

async function getLatestResource(resourceName) {
  const url =
    `https://djx.entlab.hr/m2m/data` +
    `?res=${resourceName}` +
    `&maxPayloadsPerResource=1`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.ericsson.m2m.output+json",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.HTTP_USERNAME}:${process.env.HTTP_PASSWORD}`,
        ).toString("base64"),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed ${resourceName}: ${response.status}`);
  }

  const json = await response.json();

  const value = json.contentNodes?.[0]?.value;

  return value ?? null;
}

async function getResourceHistory(resourceName) {
  const url =
    `https://djx.entlab.hr/m2m/data` +
    `?res=${resourceName}` +
    `&latestNCount=500`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.ericsson.m2m.output+json",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.HTTP_USERNAME}:${process.env.HTTP_PASSWORD}`,
        ).toString("base64"),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed ${resourceName}`);
  }

  const json = await response.json();
  return json.contentNodes ?? [];
}

server.listen(port, () => {
  console.log(`Listening on port ${port})`);
});
