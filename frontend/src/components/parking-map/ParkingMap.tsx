import type { ParkingSpot } from "../../types/parking-spot.types";
import { ParkingSpotConfig } from "./parking-map-types";

interface Props {
	spots: ParkingSpot[];
	onSpotClick?: (spot: ParkingSpot) => void;
}

export const ParkingMap: React.FC<Props> = ({ spots, onSpotClick }) => {
	return (
		<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
			{spots.map((spot) => (
				<button
					key={spot.id}
					onClick={() => onSpotClick?.(spot)}
					className={`flex h-24 flex-col items-center justify-center rounded-2xl border-2 transition-all duration-200 active:scale-95 ${ParkingSpotConfig[spot.status].style}})}`}
				>
					<span className="text-lg font-bold">{spot.id}</span>
					<span className="mt-1 text-2xl">
						{ParkingSpotConfig[spot.status].icon}
					</span>
				</button>
			))}
		</div>
	);
};
