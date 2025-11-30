// src/Components/ShortestPath.jsx
import { Polyline } from "react-leaflet";

export default function ShortestPath({ coords = [] }) {
  if (!coords || coords.length < 2) return null;

  // Only draw continuous polyline for valid coordinates
  const validPositions = coords
    .filter(c => c && c.lat != null && c.lng != null)
    .map(c => [c.lat, c.lng]);

  if (validPositions.length < 2) return null;

  return <Polyline positions={validPositions} color="blue" weight={5} />;
}
