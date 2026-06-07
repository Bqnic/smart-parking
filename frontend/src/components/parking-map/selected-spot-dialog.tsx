import { observer } from "mobx-react-lite";
import {
  ParkingSpotRamp,
  ParkingSpotStatus,
  type ParkingSpot,
} from "../../types/parking-spot.types";
import { parkingStore } from "../../stores/parking-store";

interface Props {
  selectedSpot: ParkingSpot | null;
  setSelectedSpot: (spot: ParkingSpot | null) => void;
}

export const SelectedSpotDialog: React.FC<Props> = observer(
  ({ selectedSpot, setSelectedSpot }) => {
    async function onReserveSpot() {
      try {
        await parkingStore.reserveSpot(selectedSpot!.id);

        alert(`Uspješno ste rezervirali mjesto ${selectedSpot!.id}!`);

        setSelectedSpot(null);
      } catch (err) {
        alert("Rezervacija nije uspjela.");
      }
    }

    async function onCancelReservation() {
      await parkingStore.cancelReservation(selectedSpot!.id);
      setSelectedSpot(null);
    }

    if (!selectedSpot) {
      return null;
    }

    return (
      <div
        className="
    fixed
    bottom-12
    left-1/2
    -translate-x-1/2
    z-50
    flex
    items-center
    justify-between
    gap-4
    px-4
    py-3
    bg-white
    border
    border-slate-200
    rounded-xl
    shadow-xl
    animate-in
    slide-in-from-bottom-2
    duration-200
  "
      >
        <div>
          <p className="text-sm font-bold text-slate-800">
            Mjesto {selectedSpot.id} odabrano
          </p>
          <p className="text-xs text-slate-500">
            Rampa{" "}
            {selectedSpot.ramp === ParkingSpotRamp.UP ? "dignuta" : "spuštena"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedSpot(null)}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Zatvori
          </button>

          {selectedSpot.status === ParkingSpotStatus.FREE ? (
            <button
              onClick={onReserveSpot}
              className="px-3 py-1.5 text-xs font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
            >
              Rezerviraj mjesto
            </button>
          ) : selectedSpot.status === ParkingSpotStatus.RESERVED ? (
            <button
              onClick={onCancelReservation}
              className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            >
              Otkaži rezervaciju
            </button>
          ) : null}
        </div>
      </div>
    );
  },
);
