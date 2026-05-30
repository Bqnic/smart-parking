import {
	ParkingSpotStatus,
	ParkingSpotRamp,
	type ParkingSpot,
} from "../../types/parking-spot.types";
import { ParkingSpotConfig, type PositionedSpot } from "./parking-map-types";

interface Props {
	spot: PositionedSpot;
	isSelected: boolean;
	onClick: (spot: ParkingSpot) => void;
}

export const ParkingSpotShape = ({ spot, isSelected, onClick }: Props) => {
	const cfg = ParkingSpotConfig[spot.status];
	const isFree = spot.status === ParkingSpotStatus.FREE;

	return (
		<g
			onClick={() => onClick(spot)}
			style={{ cursor: isFree ? "pointer" : "default" }}
		>
			{/* Selection glow */}
			{isSelected && (
				<rect
					x={spot.x - 5}
					y={spot.y - 5}
					width={150}
					height={100}
					rx={14}
					fill={cfg.stroke}
					opacity={0.15}
				/>
			)}

			{/* Body */}
			<rect
				x={spot.x}
				y={spot.y}
				width={140}
				height={90}
				rx={10}
				fill={cfg.fill}
				stroke={cfg.stroke}
				strokeWidth={isSelected ? 3 : 2}
			/>

			{/* Divider */}
			<line
				x1={spot.x + 2}
				y1={spot.y + 45}
				x2={spot.x + 138}
				y2={spot.y + 45}
				stroke={cfg.stroke}
				strokeDasharray="6,5"
				opacity={0.3}
			/>

			{/* Status dot */}
			<circle cx={spot.x + 16} cy={spot.y + 16} r={7} fill={cfg.stroke} />

			{/* ID */}
			<text
				x={spot.x + 70}
				y={spot.y + 52}
				textAnchor="middle"
				fontSize="22"
				fontWeight="800"
				fill={cfg.text}
			>
				{spot.id}
			</text>

			{/* Distance */}
			<text
				x={spot.x + 111}
				y={spot.y + 20}
				textAnchor="middle"
				fontSize="9"
				fontWeight="700"
				fill={cfg.text}
			>
				{spot.distance}m
			</text>

			{/* Ramp */}
			<text
				x={spot.x + 70}
				y={spot.y + 80}
				textAnchor="middle"
				fontSize="11"
				fill={cfg.text}
				opacity={0.5}
			>
				{spot.ramp === ParkingSpotRamp.UP
					? "↑ Rampa dignuta"
					: "↓ Ramp spuštena"}
			</text>
		</g>
	);
};
