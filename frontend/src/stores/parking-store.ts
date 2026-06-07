import { makeAutoObservable } from "mobx";
import {
  ParkingSpotStatus,
  type ParkingSpot,
} from "../types/parking-spot.types";
import { parkingSpotApi } from "../api/parking-spot-api";
import { ParkingLocation } from "../types/parking-location.types";

class ParkingStore {
  spots: ParkingSpot[] = [];
  activeLocation: ParkingLocation = ParkingLocation.FER;
  peakHours: {
    hour: number;
    occupiedEvents: number;
  }[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  updateSpot = (parkingSpot: ParkingSpot) => {
    if (!parkingSpot) {
      return;
    }

    const spot = this.spots.find(
      (s) => s.location === parkingSpot.location && s.id === parkingSpot.id,
    );

    if (!spot) {
      this.spots.push(parkingSpot);
      return;
    }

    const index = this.spots.indexOf(spot);
    const newSpot = {
      ...spot,
      status:
        parkingSpot.status === undefined ? spot.status : parkingSpot.status,
      ramp: parkingSpot.ramp === undefined ? spot.ramp : parkingSpot.ramp,
    };

    this.spots[index] = newSpot;
  };

  reserveSpot = async (parkingSpotId: string) => {
    try {
      await parkingSpotApi.reserve(this.activeLocation, parkingSpotId);
    } catch (err) {
      console.error("Reservation failed", err);
    }
  };

  cancelReservation = async (parkingSpotId: string) => {
    try {
      await parkingSpotApi.cancel(this.activeLocation, parkingSpotId);
    } catch (err) {
      console.error("Cancel reservation failed", err);
    }
  };

  updateParkingLocation = (newLocation: ParkingLocation) => {
    this.activeLocation = newLocation;
    this.loadPeakHours();
  };

  get parkingSpots() {
    return this.spots.filter((s) => s.location === this.activeLocation);
  }

  get freeSpotsCount() {
    return this.parkingSpots.filter((s) => s.status === ParkingSpotStatus.FREE)
      .length;
  }

  get positionedSpots() {
    const layout = [
      ["001", "002", "003", null, "004", "005", "006"],
      ["007", "008", "009", null, "010", "011", "012"],
      ["013", "014", "015", null, "016", "017", "018"],
    ];

    const spots = [];

    for (let row = 0; row < layout.length; row++) {
      for (let col = 0; col < layout[row].length; col++) {
        const spotId = layout[row][col];

        if (!spotId) continue;
        const spot = this.parkingSpots.find((s) => s.id === spotId);
        if (!spot) continue;

        let x = 100 + col * 180;
        if (col >= 4) {
          x += 60;
        }
        const y = 80 + row * 220;

        spots.push({
          ...spot,
          x,
          y,
        });
      }
    }

    return spots;
  }

  get occupiedSpotsCount() {
    return this.parkingSpots.filter(
      (s) => s.status === ParkingSpotStatus.OCCUPIED,
    ).length;
  }

  get reservedSpotsCount() {
    return this.parkingSpots.filter(
      (s) => s.status === ParkingSpotStatus.RESERVED,
    ).length;
  }

  get occupancyPercentage() {
    if (this.parkingSpots.length === 0) {
      return 0;
    }

    return Math.round(
      ((this.occupiedSpotsCount + this.reservedSpotsCount) /
        this.parkingSpots.length) *
        100,
    );
  }

  get parkingFull() {
    return this.freeSpotsCount === 0;
  }

  loadPeakHours = async () => {
    this.peakHours = await parkingSpotApi.getPeakHours(this.activeLocation);
  };

  loadInitialState = async () => {
    try {
      const spots = await parkingSpotApi.getInitialState();

      this.spots = spots;
    } catch (err) {
      console.error("Failed loading the parking state", err);
    }
  };
}

export const parkingStore = new ParkingStore();
