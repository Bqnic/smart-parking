import type { ParkingSpot } from "../types/parking-spot.types";
import { ParkingSpotConfig } from "./parking-map/parking-map-types";

export const SpotTooltip = ({
	spot,
	x,
	y,
}: {
	spot: ParkingSpot;
	x: number;
	y: number;
}) => {
	const cfg = ParkingSpotConfig[spot.status];
	return (
		<g>
			{/* Arrow */}
			<polygon
				points={`${x},${y + 2} ${x - 6},${y - 8} ${x + 6},${y - 8}`}
				fill="white"
				filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"
			/>
			{/* Card */}
			<rect
				x={x - 64}
				y={y - 58}
				width={128}
				height={52}
				rx={8}
				fill="white"
				stroke="#e2e8f0"
				strokeWidth={1}
				filter="drop-shadow(0 4px 12px rgba(0,0,0,0.12))"
			/>
			<text
				x={x}
				y={y - 38}
				textAnchor="middle"
				fontSize="11"
				fontWeight="700"
				fill="#0f172a"
				fontFamily="'DM Sans', sans-serif"
			>
				Spot {spot.id}
			</text>
			<text
				x={x}
				y={y - 22}
				textAnchor="middle"
				fontSize="10"
				fill={cfg.stroke}
				fontWeight="600"
				fontFamily="'DM Sans', sans-serif"
			>
				{cfg.label}
			</text>
			<text
				x={x}
				y={y - 9}
				textAnchor="middle"
				fontSize="9.5"
				fill="#64748b"
				fontFamily="'DM Sans', sans-serif"
			>
				{spot.distance}m away · Ramp {spot.ramp}
			</text>
		</g>
	);
};
