import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

import AddMarkerOnClick from "./AddMarkerOnClick";
import FlyToLocation from "./FlyToLocation";
import ShortestPath from "./ShortestPath";
import useGeolocate from "../hooks/useGeolocate";
import { harversineDistance } from "../Utils/distance";
import { convertNodesToCoordinates } from "../Utils/shortestPathHelpers";

export default function MapUI() {
  const [markers, setMarkers] = useState([]);
  const [placing, setPlacing] = useState(false);
  const [pathCoords, setPathCoords] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = useGeolocate();
  const mapRef = useRef(null);

  // ---------------- Add Marker Button ----------------
  const handleAddMarker = () => setPlacing(true);

  // ---------------- Compute Shortest Path ----------------
  const handleComputeShortest = async () => {
    if (!location.loaded || location.error) {
      alert("Enable location first!");
      return;
    }
    if (markers.length < 1) {
      alert("Add at least one marker!");
      return;
    }

    setLoading(true);

    const startNode = "You";
    const nodes = ["You", ...markers.map(m => m.name)];
    const distances = [];
    const userPos = { lat: location.coordinates.lat, lng: location.coordinates.lng };

    // User to marker distances
    markers.forEach(m => {
      const dist = harversineDistance(userPos, m.position);
      distances.push({ from: "You", to: m.name, weight: parseFloat(dist.toFixed(2)) });
      distances.push({ from: m.name, to: "You", weight: parseFloat(dist.toFixed(2)) });
    });

    // Marker to marker distances
    for (let i = 0; i < markers.length; i++) {
      for (let j = i + 1; j < markers.length; j++) {
        const dist = harversineDistance(markers[i].position, markers[j].position);
        distances.push({ from: markers[i].name, to: markers[j].name, weight: parseFloat(dist.toFixed(2)) });
        distances.push({ from: markers[j].name, to: markers[i].name, weight: parseFloat(dist.toFixed(2)) });
      }
    }

    const payload = { nodes, distances };

    try {
      const res = await axios.post(`http://localhost:8080/api/v1/distance/graph?start=${startNode}`, payload, {
        headers: { "Content-Type": "application/json" }
      });
      const data = res.data;

      // Convert backend shortest path nodes to coordinates
      const orderedNodes = Object.keys(data.shortest);
      const coords = convertNodesToCoordinates(orderedNodes, markers, userPos);
      setPathCoords(coords);

    } catch (err) {
      console.error(err);
      alert("Failed to compute shortest path. Check console.");
      setPathCoords([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="map-wrapper">
      {/* Buttons */}
      <div className="map-buttons">
        <button onClick={handleAddMarker}>Add Marker</button>
        <button
          onClick={handleComputeShortest}
          disabled={markers.length < 1 || !location.loaded || loading}
        >
          {loading ? "Computing..." : "Send to Backend / Draw Route"}
        </button>
      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={[6.9271, 79.8612]}
        zoom={13}
        scrollWheelZoom
        style={{ height: "90vh", width: "100%" }}
        whenCreated={map => (mapRef.current = map)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />

        {/* User location */}
        {location.loaded && !location.error && (
          <>
            <Marker position={[location.coordinates.lat, location.coordinates.lng]}>
              <Popup>You are here</Popup>
            </Marker>
            <FlyToLocation position={location.coordinates} />
          </>
        )}

        {/* Add marker on click */}
        <AddMarkerOnClick placing={placing} setPlacing={setPlacing} setMarkers={setMarkers} />

        {/* Existing markers */}
        {markers.map(m => (
          <Marker
            key={m.id}
            position={m.position}
            draggable
            eventHandlers={{
              dragend: e => {
                const { lat, lng } = e.target.getLatLng();
                setMarkers(prev => prev.map(marker => marker.id === m.id ? { ...marker, position: { lat, lng } } : marker));
              }
            }}
          >
            <Popup>
              {m.name} <br />
              Lat: {m.position.lat.toFixed(4)} <br />
              Lng: {m.position.lng.toFixed(4)} <br />
              <button onClick={() => setMarkers(prev => prev.filter(x => x.id !== m.id))}>Remove</button>
            </Popup>
          </Marker>
        ))}

        {/* Shortest Path */}
        {pathCoords.length > 1 && <ShortestPath coords={pathCoords} map={mapRef.current} />}
      </MapContainer>
    </div>
  );
}
