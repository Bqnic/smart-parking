import { observer } from "mobx-react-lite";
import type { ParkingSpot } from "../../types/parking-spot.types";
import { parkingStore } from "../../stores/parking-store";

interface Props {
	selectedSpot: ParkingSpot | null;
	setSelectedSpot: (spot: ParkingSpot | null) => void;
}

export const SelectedSpotDialog: React.FC<Props> = observer(
	({ selectedSpot, setSelectedSpot }) => {
		function onReserveSpot() {
			parkingStore.reserveSpot(selectedSpot!.id);
			console.log("Reserve spot:", selectedSpot!.id);
		}

		if (!selectedSpot) {
			return null;
		}

		return (
			<div className="flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm animate-in slide-in-from-bottom-2 duration-200">
				<div>
					<p className="text-sm font-bold text-slate-800">
						Mjesto {selectedSpot.id} odabrano
					</p>
					<p className="text-xs text-slate-500">
						{selectedSpot.distance}m udaljeno · Rampa{" "}
						{selectedSpot.ramp}
					</p>
				</div>
				<div className="flex gap-2">
					<button
						onClick={() => setSelectedSpot(null)}
						className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
					>
						Odustani
					</button>
					<button
						onClick={onReserveSpot}
						className="px-3 py-1.5 text-xs font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
					>
						Rezerviraj mjesto
					</button>
				</div>
			</div>
		);
	},
);
