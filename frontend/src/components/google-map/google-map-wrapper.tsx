import { useState, useRef } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
	width: "100%",
	height: "500px",
};

const defaultCenter = {
	lat: 45.800753,
	lng: 15.969988,
};

export default function GoogleMapWrapper() {
	const [address, setAddress] = useState(
		"24 Plitvička ul. Zagreb, Grad Zagreb",
	);
	const [position, setPosition] = useState(defaultCenter);

	const mapRef = useRef<google.maps.Map | null>(null);

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: import.meta.env.VITE_GOOGLE_API || "no",
	});

	const geocodeAddress = async () => {
		if (!address || !window.google) return;

		const geocoder = new window.google.maps.Geocoder();

		geocoder.geocode({ address }, (results, status) => {
			if (status === "OK" && results?.[0]) {
				const location = results[0].geometry.location;

				const newPos = {
					lat: location.lat(),
					lng: location.lng(),
				};

				setPosition(newPos);

				mapRef.current?.panTo(newPos);
			} else {
				console.error("Geocode failed:", status);
			}
		});
	};

	if (!isLoaded) return <div>Loading Map...</div>;

	return (
		<div>
			<div style={{ marginBottom: 10 }}>
				<input
					value={address}
					onChange={(e) => setAddress(e.target.value)}
					placeholder="Enter address"
					style={{ padding: 8, width: 300 }}
				/>
				<button onClick={geocodeAddress} style={{ marginLeft: 10 }}>
					Locate
				</button>
			</div>

			<GoogleMap
				mapContainerStyle={containerStyle}
				center={position}
				zoom={14}
				onLoad={(map: google.maps.Map) => {
					mapRef.current = map;
				}}
			>
				<Marker position={position} />
			</GoogleMap>
		</div>
	);
}
