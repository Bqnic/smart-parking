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
	},
	{
		id: "002",
		status: ParkingSpotStatus.OCCUPIED,
		ramp: ParkingSpotRamp.DOWN,
		distance: 6,
	},
	{
		id: "003",
		status: ParkingSpotStatus.RESERVED,
		ramp: ParkingSpotRamp.DOWN,
		distance: 14,
	},
	{
		id: "004",
		status: ParkingSpotStatus.FREE,
		ramp: ParkingSpotRamp.UP,
		distance: 2,
	},
	{
		id: "005",
		status: ParkingSpotStatus.OCCUPIED,
		ramp: ParkingSpotRamp.DOWN,
		distance: 4,
	},
	{
		id: "006",
		status: ParkingSpotStatus.FREE,
		ramp: ParkingSpotRamp.UP,
		distance: 6,
	},
	{
		id: "007",
		status: ParkingSpotStatus.RESERVED,
		ramp: ParkingSpotRamp.DOWN,
		distance: 15,
	},
] as ParkingSpot[];

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
			status: parkingSpot.status || spot.status,
			ramp: parkingSpot.ramp || spot.ramp,
			distance: parkingSpot.distance || spot.distance,
		};

		this.spots[index] = newSpot;
	};
}

export const parkingStore = new ParkingStore();
