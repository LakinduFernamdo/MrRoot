
import { useMap } from "react-leaflet";

export default function FlyToLocation({ position }) {
  const map = useMap();

  if (position) {
    map.flyTo([position.lat, position.lng], 14, { animate: true });
  }

  return null;
}
