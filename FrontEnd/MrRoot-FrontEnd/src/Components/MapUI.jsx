// src/Components/MapUI.jsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import RealRoute from "./RealRoute";

import AddMarkerOnClick from "./AddMarkerOnClick";
import FlyToLocation from "./FlyToLocation";
import ShortestPath from "./ShortestPath";
import useGeolocate from "../hooks/useGeolocate";
import { harversineDistance } from "../Utils/distance";
import { extractOrderedNodes, convertNodesToCoordinates } from "../Utils/shortestPathHelpers";
import HistoryTable from "./HistoryComponent.jsx"
import "../Leaflet/popup.css";

export default function MapUI() {
  const [markers, setMarkers] = useState([]);
  const [placing, setPlacing] = useState(false);
  const [pathCoords, setPathCoords] = useState([]);               // array of {lat,lng} or null
  const [shortestPathNodes, setShortestPathNodes] = useState([]); // ordered node names
  const [hopDistances, setHopDistances] = useState([]);          // array of {from,to,distance}
  const [totalDistance, setTotalDistance] = useState(0);
  const [travelTime, setTravelTime] = useState({ walk: 0, drive: 0 });
  const [loading, setLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);  //show popup Table
  const [historyData, setHistoryData] = useState([]); //render history data 


  const location = useGeolocate();
  const mapRef = useRef(null);

  // Add marker
  const handleAddMarker = () => setPlacing(true);

  // Compute shortest path
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

    try {
      const startNode = "You";
      const nodes = ["You", ...markers.map(m => m.name)];
      const distances = [];
      const userPos = { lat: location.coordinates.lat, lng: location.coordinates.lng };

      // User -> markers
      markers.forEach(m => {
        const d = harversineDistance(userPos, m.position);
        distances.push({ from: "You", to: m.name, weight: parseFloat(d.toFixed(3)) });
        distances.push({ from: m.name, to: "You", weight: parseFloat(d.toFixed(3)) });
      });

      // Marker -> marker
      for (let i = 0; i < markers.length; i++) {
        for (let j = i + 1; j < markers.length; j++) {
          const d = harversineDistance(markers[i].position, markers[j].position);
          distances.push({ from: markers[i].name, to: markers[j].name, weight: parseFloat(d.toFixed(3)) });
          distances.push({ from: markers[j].name, to: markers[i].name, weight: parseFloat(d.toFixed(3)) });
        }
      }

      const payload = { nodes, distances };
      const token = new URLSearchParams(window.location.search).get("token");
      if (token) localStorage.setItem("jwt", token);

      const res = await axios.post(
        `http://localhost:8080/api/v1/distance/graph?start=${startNode}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );


      const shortest = res.data && res.data.shortest;
      if (!shortest) {
        throw new Error("Backend did not return shortest object");
      }

      // 1) Build ordered nodes by distance (ascending)
      const orderedNodes = extractOrderedNodes(shortest); // ["You","Dehiwala",...]
      setShortestPathNodes(orderedNodes);

      // 2) Convert ordered nodes → coordinates (objects or null placeholders)
      const coords = convertNodesToCoordinates(orderedNodes, markers, userPos);
      setPathCoords(coords);

      // 3) Calculate hop-by-hop distances safely
      const hops = [];
      let total = 0;

      for (let i = 0; i < coords.length - 1; i++) {
        const a = coords[i];
        const b = coords[i + 1];

        if (!a || a.lat == null || a.lng == null || !b || b.lat == null || b.lng == null) {
          // If either side is missing, push distance 0 and warn
          console.warn("Missing coordinate for hop:", orderedNodes[i], "→", orderedNodes[i + 1]);
          hops.push({
            from: orderedNodes[i],
            to: orderedNodes[i + 1],
            distance: 0
          });
          continue;
        }

        const d = harversineDistance(a, b);
        hops.push({
          from: orderedNodes[i],
          to: orderedNodes[i + 1],
          distance: parseFloat(d.toFixed(3))
        });
        total += d;
      }

      setHopDistances(hops);
      setTotalDistance(parseFloat(total.toFixed(3)));

      // 4) Estimate travel time
      const WALK_KMH = 5;
      const DRIVE_KMH = 40;
      setTravelTime({
        walk: parseFloat(((total / WALK_KMH) * 60).toFixed(1)),   // minutes
        drive: parseFloat(((total / DRIVE_KMH) * 60).toFixed(1))  // minutes
      });

      // 5) Fit map to drawn path if possible: use only valid coords
      const validLatLngs = coords.filter(c => c && c.lat != null && c.lng != null)
        .map(c => [c.lat, c.lng]);
      if (mapRef.current && validLatLngs.length > 0) {
        try {
          mapRef.current.fitBounds(validLatLngs, { padding: [40, 40] });
        } catch (e) {
          // ignore
        }
      }

    } catch (err) {
      console.error("Compute shortest error:", err);
      alert("Failed to compute shortest path. Check console." + err);
      // reset safe state
      setPathCoords([]);
      setShortestPathNodes([]);
      setHopDistances([]);
      setTotalDistance(0);
      setTravelTime({ walk: 0, drive: 0 });
    } finally {
      setLoading(false);
    }
  };


  // fetch history
  const fetchHistory = async () => {
  try {
    let token = localStorage.getItem("token");

    if (!token) {
      token = new URLSearchParams(window.location.search).get("token");
      if (token) localStorage.setItem("token", token);
    }

    const response = await axios.get(
      "http://localhost:8080/api/v1/history",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setHistoryData(Array.isArray(response.data) ? response.data : []);
    setShowPopup(true);

  } catch (error) {
    console.error("Error fetching history:", error);
    alert("Error fetching history");
  }
};


  return (
    <div className="map-wrapper">

      {/* Buttons */}
      <div className="map-buttons" style={{ marginBottom: 8 }}>
        <button onClick={handleAddMarker}>Add Marker</button>
        <button
          onClick={handleComputeShortest}
          disabled={markers.length < 1 || !location.loaded || loading}
          style={{ marginLeft: 8 }}
        >
          {loading ? "Computing..." : "Send to Backend / Draw Route"}
        </button>

        <button onClick={fetchHistory}>Show History</button>

        

{showPopup && (
  <HistoryTable
    historyData={historyData}
    onClose={() => setShowPopup(false)}
  />
)}


        



      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={[6.9271, 79.8612]}
        zoom={13}
        scrollWheelZoom
        style={{ height: "72vh", width: "100%" }}
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
        <AddMarkerOnClick
          placing={placing}
          setPlacing={setPlacing}
          setMarkers={setMarkers}
          markers={markers}
        />

        {/* Existing markers */}
        {markers.map(m => (
          <Marker
            key={m.id}
            position={[m.position.lat, m.position.lng]}
            draggable
            eventHandlers={{
              dragend: e => {
                const { lat, lng } = e.target.getLatLng();
                setMarkers(prev =>
                  prev.map(marker =>
                    marker.id === m.id ? { ...marker, position: { lat, lng } } : marker
                  )
                );
              }
            }}
          >
            <Popup>
              {m.name} <br />
              Lat: {m.position.lat.toFixed(4)} <br />
              Lng: {m.position.lng.toFixed(4)} <br />
              <button
                onClick={() =>
                  setMarkers(prev => prev.filter(x => x.id !== m.id))
                }
              >
                Remove
              </button>
            </Popup>
          </Marker>
        ))}

        {/* Shortest path polyline */}
        {pathCoords && pathCoords.length > 0 && (
          <ShortestPath coords={pathCoords} />
        )}

        {/* Real road routes between hops */}
        {pathCoords &&
          pathCoords.length > 1 &&
          pathCoords.map((point, i) => {
            if (i === pathCoords.length - 1) return null;

            const from = pathCoords[i];
            const to = pathCoords[i + 1];

            if (!from || !to) return null;

            return (
              <RealRoute
                key={`real-${i}`}
                from={from}
                to={to}
              />
            );
          })}
      </MapContainer>

      {/* ---------------- SHORT PATH INFO ---------------- */}
      {shortestPathNodes.length > 0 && (
        <div
          style={{
            marginTop: "10px",
            padding: "15px",
            background: "#f8f9fa",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}
        >
          <h3>📌 Shortest Path Order</h3>
          <p style={{ fontSize: "16px" }}>
            {shortestPathNodes.join(" → ")}
          </p>

          <h4>🔹 Distance Between Each Hop</h4>
          <ul>
            {hopDistances.map((h, idx) => (
              <li key={idx}>
                {h.from} → {h.to}: <b>{h.distance.toFixed(2)} km</b>
              </li>
            ))}
          </ul>

          <h4>📏 Total Distance</h4>
          <p><b>{totalDistance.toFixed(2)} km</b></p>

          <h4>⏱ Estimated Time</h4>
          <p>
            🚶 Walking: <b>{travelTime.walk.toFixed(1)} minutes</b><br />
            🚗 Driving: <b>{travelTime.drive.toFixed(1)} minutes</b>
          </p>

        </div>
      )}
    </div>
  );
}
