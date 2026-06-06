interface ParkingLocationInfo {
	displayName: string;
	address: string;
}

export enum ParkingLocation {
	FER = "FER",
	ARENA = "ARENA",
}

export const PARKINGS: Record<ParkingLocation, ParkingLocationInfo> = {
	[ParkingLocation.FER]: {
		displayName: "FER",
		address: "24 Plitvička ul. Zagreb, Grad Zagreb",
	},
	[ParkingLocation.ARENA]: {
		displayName: "Arena Zagreb",
		address: "Ul. Vice Vukova 8, Zagreb, Croatia",
	},
};
