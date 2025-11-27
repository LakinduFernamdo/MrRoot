import { useMapEvents } from "react-leaflet";
import { v4 as uuidv4 } from "uuid";

export default function AddMarkerOnClick({ placing, setPlacing, setMarkers }) {
  useMapEvents({
    click(e) {
      if (!placing) return;
      const name = prompt("Enter marker name:");
      if (!name) return;

      const newMarker = {
        id: uuidv4(),
        name,
        position: { lat: e.latlng.lat, lng: e.latlng.lng }
      };
      setMarkers(prev => [...prev, newMarker]);
      setPlacing(false);
    }
  });
  return null;
}
