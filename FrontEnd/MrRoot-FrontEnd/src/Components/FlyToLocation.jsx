// src/Components/FlyToLocation.jsx
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function FlyToLocation({ position }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !position) return;
    map.flyTo([position.lat, position.lng], 14, { duration: 1.2 });
  }, [map, position]);

  return null;
}
