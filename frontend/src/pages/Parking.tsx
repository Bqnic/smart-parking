import { observer } from "mobx-react-lite";
import { ParkingMap } from "../components/parking-map/ParkingMap";
import { ParkingSpotStatus } from "../types/parking-spot.types";
import { parkingStore } from "../stores/parking-store";

export const Parking: React.FC = observer(() => {
	const { spots } = parkingStore;

	const freeSpots = spots.filter(
		(spot) => spot.status === ParkingSpotStatus.FREE,
	).length;

	return (
		<main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-5xl flex-col px-4 py-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">
					Parking
				</h1>

				<p className="mt-2 text-gray-600">
					Prikaz dostupnosti parking mjesta u stvarnom vremenu.
				</p>
			</div>

			<div className="mt-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold text-gray-900">
						Slobodna mjesta
					</h2>

					<div className="rounded-2xl bg-emerald-100 px-4 py-2 text-lg font-bold text-emerald-700">
						{freeSpots}
					</div>
				</div>

				<div className="mt-5 flex flex-wrap gap-3 text-sm">
					<div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-emerald-700">
						<span>🟢</span>
						<span>Slobodno</span>
					</div>

					<div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-red-700">
						<span>🔴</span>
						<span>Zauzeto</span>
					</div>

					<div className="flex items-center gap-2 rounded-xl bg-orange-50 px-3 py-2 text-orange-700">
						<span>🟠</span>
						<span>Rezervirano</span>
					</div>
				</div>
			</div>

			<section className="mt-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
				<div className="mb-5">
					<h2 className="text-lg font-semibold text-gray-900">
						Tlocrt parkinga
					</h2>

					<p className="mt-1 text-sm text-gray-500">
						Klikni na slobodno mjesto za rezervaciju.
					</p>
				</div>

				<ParkingMap />
			</section>
		</main>
	);
});
