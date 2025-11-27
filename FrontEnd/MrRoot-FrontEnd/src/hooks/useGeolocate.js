// src/hooks/useGeolocate.js
import { useEffect, useState } from "react";

export default function useGeolocate() {
  const [state, setState] = useState({
    loaded: false,
    error: null,
    coordinates: { lat: 0, lng: 0 }
  });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setState(s => ({ ...s, loaded: true, error: "No geolocation" }));
      return;
    }

    const success = pos => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setState({ loaded: true, error: null, coordinates: coords });
    };

    const error = err => {
      setState({ loaded: true, error: err.message, coordinates: { lat: 0, lng: 0 } });
    };

    const watcher = navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      maximumAge: 60 * 1000
    });

    return () => {
      // nothing to clear for getCurrentPosition
    };
  }, []);

  return state;
}
