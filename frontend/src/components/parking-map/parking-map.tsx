import { observer } from "mobx-react-lite";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useState } from "react";
import { parkingStore } from "../../stores/parking-store";
import {
	ParkingSpotStatus,
	type ParkingSpot,
} from "../../types/parking-spot.types";
import { Legend } from "./legend";
import { ParkingSpotShape } from "./parking-spot-shape";
import { SelectedSpotDialog } from "./selected-spot-dialog";

export const ParkingMap = observer(() => {
	const { spots } = parkingStore;
	const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);

	const freeCount = spots.filter(
		(s) => s.status === ParkingSpotStatus.FREE,
	).length;

	const handleSpotClick = (spot: ParkingSpot) => {
		if (spot.status !== ParkingSpotStatus.FREE) return;
		setSelectedSpot((prev) => (prev?.id === spot.id ? null : spot));
	};

	return (
		<div className="flex flex-col gap-3 h-full">
			{/* Header bar */}
			<div className="flex items-center justify-between px-1">
				<div>
					<h2
						className="text-lg font-bold text-slate-800"
						style={{ fontFamily: "'DM Sans', sans-serif" }}
					>
						Mapa
					</h2>
					<p className="text-xs text-slate-500">
						<span className="font-semibold text-green-600">
							{freeCount}
						</span>{" "}
						od {spots.length} mjesta slobodno
					</p>
				</div>
				<Legend />
			</div>

			{/* Map */}
			<div className="relative flex-1 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-inner">
				{/* Subtle grid background */}
				<svg
					className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<defs>
						<pattern
							id="grid"
							width="40"
							height="40"
							patternUnits="userSpaceOnUse"
						>
							<path
								d="M 40 0 L 0 0 0 40"
								fill="none"
								stroke="#cbd5e1"
								strokeWidth="0.5"
							/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#grid)" />
				</svg>

				<TransformWrapper
					centerOnInit
					minScale={0.4}
					maxScale={5}
					limitToBounds={false}
					wheel={{ step: 0.08 }}
					panning={{ velocityDisabled: true }}
				>
					<TransformComponent
						wrapperStyle={{ width: "100%", height: "100%" }}
						contentStyle={{ width: "100%", height: "100%" }}
					>
						<svg
							viewBox="0 0 1050 620"
							width="1050"
							height="620"
							xmlns="http://www.w3.org/2000/svg"
						>
							{/* Road surface */}
							<rect
								x="30"
								y="270"
								width="990"
								height="80"
								rx="0"
								fill="#cbd5e1"
							/>
							{/* Lane marking */}
							<line
								x1="30"
								y1="310"
								x2="1020"
								y2="310"
								stroke="white"
								strokeWidth="2"
								strokeDasharray="30,20"
							/>
							{/* Road edge lines */}
							<line
								x1="30"
								y1="272"
								x2="1020"
								y2="272"
								stroke="#94a3b8"
								strokeWidth="1.5"
							/>
							<line
								x1="30"
								y1="348"
								x2="1020"
								y2="348"
								stroke="#94a3b8"
								strokeWidth="1.5"
							/>

							{/* Entry arrow */}
							<text
								x="38"
								y="300"
								fontSize="11"
								fill="#64748b"
								fontWeight="600"
								fontFamily="'DM Sans', sans-serif"
							>
								ENTER →
							</text>
							<text
								x="38"
								y="340"
								fontSize="11"
								fill="#64748b"
								fontWeight="600"
								fontFamily="'DM Sans', sans-serif"
							>
								← EXIT
							</text>

							{/* Spots */}
							{spots.map((spot) => (
								<ParkingSpotShape
									key={spot.id}
									spot={spot}
									isSelected={selectedSpot?.id === spot.id}
									onClick={handleSpotClick}
								/>
							))}
						</svg>
					</TransformComponent>
				</TransformWrapper>
			</div>

			<SelectedSpotDialog
				selectedSpot={selectedSpot}
				setSelectedSpot={setSelectedSpot}
			/>
		</div>
	);
});
