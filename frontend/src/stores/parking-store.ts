import { makeAutoObservable } from "mobx";
import {
	ParkingSpotRamp,
	ParkingSpotStatus,
	type ParkingSpot,
} from "../types/parking-spot.types";

// test data
const parkingSpots = [
	{
		id: "001",
		status: ParkingSpotStatus.FREE,
		ramp: ParkingSpotRamp.DOWN,
		distance: 4,
		x: 80,
		y: 480,
	},
	{
		id: "002",
		status: ParkingSpotStatus.OCCUPIED,
		ramp: ParkingSpotRamp.DOWN,
		distance: 6,
		x: 270,
		y: 480,
	},
	{
		id: "003",
		status: ParkingSpotStatus.RESERVED,
		ramp: ParkingSpotRamp.DOWN,
		distance: 14,
		x: 460,
		y: 480,
	},
	{
		id: "004",
		status: ParkingSpotStatus.FREE,
		ramp: ParkingSpotRamp.UP,
		distance: 2,
		x: 180,
		y: 110,
	},
	{
		id: "005",
		status: ParkingSpotStatus.FREE,
		ramp: ParkingSpotRamp.DOWN,
		distance: 4,
		x: 650,
		y: 480,
	},
	{
		id: "006",
		status: ParkingSpotStatus.FREE,
		ramp: ParkingSpotRamp.UP,
		distance: 6,
		x: 550,
		y: 110,
	},
	{
		id: "007",
		status: ParkingSpotStatus.RESERVED,
		ramp: ParkingSpotRamp.DOWN,
		distance: 15,
		x: 840,
		y: 480,
	},
];

class ParkingStore {
	spots: ParkingSpot[] = [...parkingSpots];

	constructor() {
		makeAutoObservable(this);
	}

	updateSpot = (parkingSpot: ParkingSpot) => {
		const spot = this.spots.find((s) => s.id === parkingSpot.id);
		if (!spot) {
			this.spots.push(parkingSpot);
			return;
		}

		const index = this.spots.indexOf(spot);
		const newSpot = {
			...spot,
			status:
				parkingSpot.status === undefined
					? spot.status
					: parkingSpot.status,
			ramp: parkingSpot.ramp === undefined ? spot.ramp : parkingSpot.ramp,
			distance:
				parkingSpot.distance === undefined
					? spot.distance
					: parkingSpot.distance,
		};

		this.spots[index] = newSpot;
	};
}

export const parkingStore = new ParkingStore();
