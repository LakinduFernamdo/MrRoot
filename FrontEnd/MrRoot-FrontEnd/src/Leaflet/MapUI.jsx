import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { useState, useRef } from "react";
import MapAttribute from "./Mapattributes";
import "./Map.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerImg from "../assets/Marker.png";
import useGeolocate from "./useGeolocate";

// handle clicking on the map
function AddMarkerOnClick({ placing, setPlacing, markers, setMarkers }) {
  useMapEvents({
    click(e) {
      if (placing) {
        setMarkers((prev) => [
          ...prev,
          {
            id: Date.now(), // unique ID
            position: e.latlng
          }
        ]);
        setPlacing(false);
      }
    }
  });
  return null;
}

function MapUI() {
  const [center] = useState([6.9271, 79.8612]);
  const zoomLevel = 9;

  const location = useGeolocate();
  const mapRef = useRef(null);

  const [placing, setPlacing] = useState(false);
  const [markers, setMarkers] = useState([]);

  const showMyLocation = () => {
    if (location.loaded && !location.error && mapRef.current) {
      mapRef.current.flyTo(
        [location.coordinates.lat, location.coordinates.lng],
        14,
        { animate: true }
      );
    } else if (location.error) {
      alert(location.error.message);
    }
  };

  const markerIcon = new L.Icon({
    iconUrl: markerImg,
    iconSize: [25, 35],
    iconAnchor: [12, 30],
    popupAnchor: [0, -30],
  });

  const removeMarker = (id) => {
    setMarkers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="map-wrapper">
      <MapContainer
        center={center}
        zoom={zoomLevel}
        scrollWheelZoom={true}
        ref={mapRef}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url={MapAttribute.maptiler.url}
          attribution={MapAttribute.maptiler.attribution}
        />

        {/* Current location */}
        {location.loaded && !location.error && (
          <Marker
            icon={markerIcon}
            position={[location.coordinates.lat, location.coordinates.lng]}
          >
            <Popup><b>You are here</b></Popup>
          </Marker>
        )}

        {/* Render all markers */}
        {markers.map((m) => (
          <Marker
            key={m.id}
            icon={markerIcon}
            position={m.position}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const { lat, lng } = e.target.getLatLng();
                setMarkers((prev) =>
                  prev.map((marker) =>
                    marker.id === m.id
                      ? { ...marker, position: { lat, lng } }
                      : marker
                  )
                );
              }
            }}
          >
            <Popup>
              <div>
                Custom Marker <br />
                Lat: {m.position.lat.toFixed(4)} <br />
                Lng: {m.position.lng.toFixed(4)} <br />
                <button onClick={() => removeMarker(m.id)}>Remove</button>
              </div>
            </Popup>
          </Marker>
        ))}

        <AddMarkerOnClick
          placing={placing}
          setPlacing={setPlacing}
          markers={markers}
          setMarkers={setMarkers}
        />
      </MapContainer>

      {/* UI buttons */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={showMyLocation}>Locate Me</button>
        <button onClick={() => setPlacing(true)} style={{ marginLeft: "10px" }}>
          Add Marker
        </button>
      </div>
    </div>
  );
}

export default MapUI;
