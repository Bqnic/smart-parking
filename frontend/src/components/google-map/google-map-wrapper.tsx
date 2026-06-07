import { useState, useRef, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 45.800753,
  lng: 15.969988,
};

interface Props {
  address: string;
}

export const GoogleMapWrapper: React.FC<Props> = ({ address }) => {
  const [position, setPosition] = useState(defaultCenter);

  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API || "no",
  });

  useEffect(() => {
    if (!isLoaded || !address) return;

    geocodeAddress();
  }, [address, isLoaded]);

  const geocodeAddress = () => {
    if (!window.google || !address) return;

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
    <div className="h-[400px]">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={14}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
        <Marker position={position} />
      </GoogleMap>
    </div>
  );
};
