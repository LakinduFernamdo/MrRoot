import { MapContainer, Marker, Popup, TileLayer, useMapEvents, useMap } from "react-leaflet";
import { useState } from "react";
import MapAttribute from "./Mapattributes";
import "./Map.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerImg from "../assets/Marker.png";
import useGeolocate from "./useGeolocate";
import { harversineDistance } from "../Utils/distance";
import { reverseGeocode } from "../Utils/geocode";

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

function FlyToLocation({ position }) {
  const map = useMap();
  if (position) {
    map.flyTo([position.lat, position.lng], 14, { animate: true });
  }
  return null;
}

function MapUI() {
  const [center] = useState([6.9271, 79.8612]);

  const zoomLevel = 9;
  const location = useGeolocate();

  const [placing, setPlacing] = useState(false);
  const [markers, setMarkers] = useState([]);

  //  store ALL results here
  const [distanceResults, setDistanceResults] = useState([]);

  const markerIcon = new L.Icon({
    iconUrl: markerImg,
    iconSize: [25, 35],
    iconAnchor: [12, 30],
    popupAnchor: [0, -30],
  });

  const removeMarker = (id) => {
    setMarkers((prev) => prev.filter((m) => m.id !== id));
  };

  //  Distances *from me* shown in UI now
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

    setDistanceResults(results); //  update UI
  };

  //  pairwise unique (A→B only)
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

  //  All full combinations (A→B, B→A, etc.)
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

  return (
    <div className="map-wrapper">
      <MapContainer
        center={center}
        zoom={zoomLevel}
        scrollWheelZoom={true}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url={MapAttribute.maptiler.url}
          attribution={MapAttribute.maptiler.attribution}
        />

        {location.loaded && !location.error && (
          <>
            <Marker
              icon={markerIcon}
              position={[location.coordinates.lat, location.coordinates.lng]}
            >
              <Popup>You are here!</Popup>
            </Marker>

            <FlyToLocation
              position={{
                lat: location.coordinates.lat,
                lng: location.coordinates.lng,
              }}
            />
          </>
        )}

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
      </MapContainer>

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => setPlacing(true)}>Add Marker</button>
        <button onClick={calculateDistanceFromMe}>Distances From Me</button>
        <button onClick={calculateMarkerToMarkerDistance}>Marker Distances</button>
        <button onClick={calculateAllPairDistancesForEach}>All Pairs</button>
        <button onClick={sendAPI}>Give shortest path</button>
      </div>

      {/*  Unified output area */}
      <div className="distance-output">
        <h3>Distance Results</h3>

        {distanceResults.length === 0 && <p>No distances calculated</p>}

        <ul>
          {distanceResults.map((item, index) => (
            <li key={index}>
              <strong>{item.from}</strong> → {item.to}: {item.distance_km} km
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MapUI;
