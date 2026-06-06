import type { ParkingLocation } from "./parking-location.types";

export enum ParkingSpotStatus {
	FREE = 0,
	RESERVED = 1,
	OCCUPIED = 2,
}

export enum ParkingSpotRamp {
	DOWN = 0,
	UP = 1,
}

export interface ParkingSpot {
	location: ParkingLocation;
	id: string;
	status: ParkingSpotStatus;
	ramp: ParkingSpotRamp;
	distance: number;
}
