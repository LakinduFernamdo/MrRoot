// components/AddMarkerOnClick.jsx
import { useMapEvents } from "react-leaflet";
import { reverseGeocode } from "../Utils/geocode";

export default function AddMarkerOnClick({ placing, setPlacing, setMarkers }) {
  useMapEvents({
    click(e) {
      if (placing) {
        (async () => {
          const name = await reverseGeocode(e.latlng.lat, e.latlng.lng);
          setMarkers((prev) => [
            ...prev,
            {
              id: Date.now(),
              position: e.latlng,
              name,
            },
          ]);
          setPlacing(false);
        })();
      }
    },
  });

  return null;
}
