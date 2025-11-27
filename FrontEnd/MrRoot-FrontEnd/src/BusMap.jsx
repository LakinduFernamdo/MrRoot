import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

// Fix default marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const busStops = [
  { name: "Stop A", lat: 6.9271, lng: 79.8612 },
  { name: "Stop B", lat: 6.9300, lng: 79.8650 },
  { name: "Stop C", lat: 6.9330, lng: 79.8700 },
  { name: "Stop D", lat: 6.9370, lng: 79.8750 },
];

export default function BusMap() {
  const center = [6.9271, 79.8612];

  const routePositions = busStops.map(stop => [stop.lat, stop.lng]);

  return (
    <MapContainer center={center} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
      />

      {/* Draw route line */}
      <Polyline positions={routePositions} />

      {/* Markers */}
      {busStops.map((stop, index) => (
        <Marker key={index} position={[stop.lat, stop.lng]}>
          <Popup>{stop.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
