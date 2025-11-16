import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
  useMap,
  Polyline
} from "react-leaflet";

import { useState } from "react";
import MapAttribute from "./Mapattributes";
import "./Map.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerImg from "../assets/Marker.png";
import useGeolocate from "./useGeolocate";
import { harversineDistance } from "../Utils/distance";
import { reverseGeocode } from "../Utils/geocode";
import axios from "axios";



// Add Marker on Click

function AddMarkerOnClick({ placing, setPlacing, setMarkers }) {
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


// Fly to user location

function FlyToLocation({ position }) {
  const map = useMap();
  if (position) {
    map.flyTo([position.lat, position.lng], 14, { animate: true });
  }
  return null;
}



// MAIN COMPONENT

function MapUI() {
  const [center] = useState([6.9271, 79.8612]);
  const zoomLevel = 9;
  const location = useGeolocate();

  const [placing, setPlacing] = useState(false);
  const [markers, setMarkers] = useState([]);

  const [distanceResults, setDistanceResults] = useState([]);
  const [shortestPath, setShortestPath] = useState(null); // used for polylines

  const markerIcon = new L.Icon({
    iconUrl: markerImg,
    iconSize: [25, 35],
    iconAnchor: [12, 30],
    popupAnchor: [0, -30],
  });

  const removeMarker = (id) => {
    setMarkers((prev) => prev.filter((m) => m.id !== id));
  };



  // Distances FROM Me

  const calculateDistanceFromMe = () => {
    if (!location.loaded || location.error) return;

    const myPos = {
      lat: location.coordinates.lat,
      lng: location.coordinates.lng,
    };

    const results = markers.map((m) => ({
      from: "You",
      to: m.name,
      distance_km: harversineDistance(myPos, m.position).toFixed(2),
    }));

    setDistanceResults(results);
  };

 
  // Marker → Marker distances (unique)
 
  const calculateMarkerToMarkerDistance = () => {
    const results = [];

    for (let i = 0; i < markers.length; i++) {
      for (let j = i + 1; j < markers.length; j++) {
        results.push({
          from: markers[i].name,
          to: markers[j].name,
          distance_km: harversineDistance(markers[i].position, markers[j].position).toFixed(2),
        });
      }
    }

    setDistanceResults(results);
  };

  // --------------------------------------------
  // All combinations A→B and B→A
  // --------------------------------------------
  const calculateAllPairDistancesForEach = () => {
    const results = [];

    markers.forEach((m1) => {
      markers.forEach((m2) => {
        if (m1.id !== m2.id) {
          results.push({
            from: m1.name,
            to: m2.name,
            distance_km: harversineDistance(m1.position, m2.position).toFixed(2),
          });
        }
      });
    });

    setDistanceResults(results);
  };


  // ------------------------------------------------------------
  // Send shortest path request to backend
  // ------------------------------------------------------------
  const sendShortestPathRequest = async () => {
    if (!location.loaded || location.error) {
      alert("Location not available ! Turn on your location");
      return;
    }

    const startNode = "You";

    const nodes = ["You", ...markers.map(m => m.name)];

    const distances = [];

    // You → Markers
    markers.forEach(m => {
      distances.push({
        from: "You",
        to: m.name,
        weight: parseFloat(
          harversineDistance(
            { lat: location.coordinates.lat, lng: location.coordinates.lng },
            m.position
          ).toFixed(2)
        ),
      });
    });

    // Marker ↔ Marker
    for (let i = 0; i < markers.length; i++) {
      for (let j = i + 1; j < markers.length; j++) {
        const dist = parseFloat(
          harversineDistance(markers[i].position, markers[j].position).toFixed(2)
        );

        distances.push({ from: markers[i].name, to: markers[j].name, weight: dist });
        distances.push({ from: markers[j].name, to: markers[i].name, weight: dist });
      }
    }

    const payload = { nodes, distances };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/distance/graph?start=" + startNode,
        payload,
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      setDistanceResults(response.data.shortest);
      setShortestPath(response.data.shortest); // save to draw polylines

      alert("Success!");

    } catch (err) {
      alert("Backend error: " + err);
    }
  };


 
  // Build Polyline path based on backend shortest path result
  
  const buildPolylinePoints = () => {
    if (!shortestPath || !location.loaded) return [];

    let points = [];

    const userPoint = {
      lat: location.coordinates.lat,
      lng: location.coordinates.lng
    };

    // sort nodes by distance (except You)
    const sorted = Object.entries(shortestPath)
      .filter(([name]) => name !== "You")
      .sort((a, b) => a[1] - b[1]);

    points.push([userPoint.lat, userPoint.lng]);

    sorted.forEach(([name]) => {
      const m = markers.find(mm => mm.name === name);
      if (m) points.push([m.position.lat, m.position.lng]);
    });

    return points;
  };


  const polylinePoints = buildPolylinePoints();



  // RENDER

  return (
    <div className="map-wrapper">

      {/* MAP */}
      <MapContainer
        className="my-map-container"
        center={center}
        zoom={zoomLevel}
        scrollWheelZoom={true}
      >
        <TileLayer
          url={MapAttribute.maptiler.url}
          attribution={MapAttribute.maptiler.attribution}
        />

        {/* USER LOCATION */}
        {location.loaded && !location.error && (
          <>
            <Marker
              icon={markerIcon}
              position={[location.coordinates.lat, location.coordinates.lng]}
            >
              <Popup>You are here now !</Popup>
            </Marker>

            <FlyToLocation
              position={{
                lat: location.coordinates.lat,
                lng: location.coordinates.lng,
              }}
            />
          </>
        )}

        {/* MARKERS */}
        {markers.map((m) => (
          <Marker
            key={m.id}
            icon={markerIcon}
            position={m.position}
            draggable={true}
            eventHandlers={{
              dragend: async (e) => {
                const { lat, lng } = e.target.getLatLng();
                const name = await reverseGeocode(lat, lng);

                setMarkers((prev) =>
                  prev.map((marker) =>
                    marker.id === m.id
                      ? { ...marker, position: { lat, lng }, name }
                      : marker
                  )
                );
              },
            }}
          >
            <Popup>
              <strong>{m.name}</strong> <br />
              Lat: {m.position.lat.toFixed(4)} <br />
              Lng: {m.position.lng.toFixed(4)} <br />
              <button onClick={() => removeMarker(m.id)}>Remove</button>
            </Popup>
          </Marker>
        ))}

        <AddMarkerOnClick placing={placing} setPlacing={setPlacing} setMarkers={setMarkers} />

        {/* DRAW POLYLINE */}
        {polylinePoints.length > 1 && (
          <Polyline positions={polylinePoints} color="red" weight={4} />
        )}
      </MapContainer>


      {/* BUTTONS */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => setPlacing(true)}>Add Marker</button>
        <button onClick={calculateDistanceFromMe}>Distances From Me</button>
        <button onClick={calculateMarkerToMarkerDistance}>Marker Distances</button>
        <button onClick={calculateAllPairDistancesForEach}>All Pairs</button>
        <button onClick={sendShortestPathRequest}>Give shortest path</button>
      </div>


      {/* OUTPUT */}
      <div className="distance-output">
        <h3>Distance Results</h3>

        {distanceResults.length === 0 && typeof distanceResults !== "object" && (
          <p>No distances calculated</p>
        )}

        {/* Backend shortest path mode */}
        {typeof distanceResults === "object" && !Array.isArray(distanceResults) ? (
          <ul>
            {Object.entries(distanceResults).map(([node, dist]) => (
              <li key={node}>{node}: {dist} km</li>
            ))}
          </ul>
        ) : (
          <ul>
            {distanceResults.map((item, index) => (
              <li key={index}>
                {item.from} → {item.to}: {item.distance_km} km
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}

export default MapUI;
