import { makeAutoObservable } from "mobx";
import {
	ParkingSpotRamp,
	ParkingSpotStatus,
	type ParkingSpot,
} from "../types/parking-spot.types";
import { parkingSpotApi } from "../api/parking-spot-api";
import { ParkingLocation } from "../types/parking-location.types";

// test data
// TODO: REMOVE AFTER GETTING STATE FROM IOT PLATFORM
const parkingSpots = [
	{
		location: ParkingLocation.FER,
		id: "001",
		status: ParkingSpotStatus.FREE,
		ramp: ParkingSpotRamp.DOWN,
		distance: 4,
	},
	{
		location: ParkingLocation.FER,
		id: "002",
		status: ParkingSpotStatus.OCCUPIED,
		ramp: ParkingSpotRamp.DOWN,
		distance: 6,
	},
	{
		location: ParkingLocation.FER,
		id: "003",
		status: ParkingSpotStatus.RESERVED,
		ramp: ParkingSpotRamp.DOWN,
		distance: 14,
	},
	{
		location: ParkingLocation.FER,
		id: "004",
		status: ParkingSpotStatus.FREE,
		ramp: ParkingSpotRamp.UP,
		distance: 2,
	},
	{
		location: ParkingLocation.FER,
		id: "005",
		status: ParkingSpotStatus.FREE,
		ramp: ParkingSpotRamp.DOWN,
		distance: 4,
	},
	{
		location: ParkingLocation.FER,
		id: "006",
		status: ParkingSpotStatus.FREE,
		ramp: ParkingSpotRamp.UP,
		distance: 6,
	},
	{
		location: ParkingLocation.FER,
		id: "007",
		status: ParkingSpotStatus.RESERVED,
		ramp: ParkingSpotRamp.DOWN,
		distance: 15,
	},
	{
		location: ParkingLocation.FER,
		id: "008",
		status: ParkingSpotStatus.RESERVED,
		ramp: ParkingSpotRamp.DOWN,
		distance: 15,
	},
	{
		location: ParkingLocation.ARENA_CENTAR,
		id: "004",
		status: ParkingSpotStatus.FREE,
		ramp: ParkingSpotRamp.UP,
		distance: 2,
	},
	{
		location: ParkingLocation.ARENA_CENTAR,
		id: "005",
		status: ParkingSpotStatus.FREE,
		ramp: ParkingSpotRamp.DOWN,
		distance: 4,
	},
	{
		location: ParkingLocation.ARENA_CENTAR,
		id: "006",
		status: ParkingSpotStatus.FREE,
		ramp: ParkingSpotRamp.UP,
		distance: 6,
	},
	{
		location: ParkingLocation.ARENA_CENTAR,
		id: "007",
		status: ParkingSpotStatus.RESERVED,
		ramp: ParkingSpotRamp.DOWN,
		distance: 15,
	},
	{
		location: ParkingLocation.ARENA_CENTAR,
		id: "008",
		status: ParkingSpotStatus.RESERVED,
		ramp: ParkingSpotRamp.DOWN,
		distance: 15,
	},
];

const ROAD_Y = 270;
const TOP_Y = ROAD_Y - 110;
const BOTTOM_Y = ROAD_Y + 110;

const START_X = 80;
const STEP_X = 170;

class ParkingStore {
	spots: ParkingSpot[] = [...parkingSpots];
	activeLocation: ParkingLocation = ParkingLocation.FER;

	constructor() {
		makeAutoObservable(this);
	}

	updateSpot = (parkingSpot: ParkingSpot) => {
		if (!parkingSpot) {
			return;
		}

		const spot = this.spots.find(
			(s) =>
				s.location === parkingSpot.location && s.id === parkingSpot.id,
		);

		if (!spot) {
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

	reserveSpot = (parkingSpotId: string) => {
		parkingSpotApi.reserve(this.activeLocation, parkingSpotId);
	};

	updateParkingLocation = (newLocation: ParkingLocation) => {
		this.activeLocation = newLocation;
	};

	get parkingSpots() {
		return this.spots.filter((s) => s.location === this.activeLocation);
	}

	get freeSpotsCount() {
		return this.parkingSpots.filter(
			(s) => s.status === ParkingSpotStatus.FREE,
		).length;
	}

	get positionedSpots() {
		const half = Math.ceil(this.parkingSpots.length / 2);

		return this.parkingSpots.map((spot, i) => {
			const isTop = i < half;
			const laneIndex = isTop ? i : i - half;

			return {
				...spot,
				x: START_X + laneIndex * STEP_X,
				y: isTop ? TOP_Y : BOTTOM_Y,
			};
		});
	}
}

export const parkingStore = new ParkingStore();
