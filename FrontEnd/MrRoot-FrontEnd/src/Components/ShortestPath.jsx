import { Polyline } from "react-leaflet";

export default function ShortestPath({ coords }) {
  if (!coords || coords.length < 2) return null;

  const positions = coords.map(c => [c[0], c[1]]);

  return <Polyline positions={positions} color="blue" weight={5} />;
}
/*
import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";


export default function ShortestPath({ coords, map }) {
  useEffect(() => {
    if (!map || !coords || coords.length < 2) return;

    if (map._routingControl) {
      map.removeControl(map._routingControl);
      map._routingControl = null;
    }

    const waypoints = coords.map(c => L.latLng(c[0], c[1]));

    const routingControl = L.Routing.control({
      waypoints,
      lineOptions: { styles: [{ color: "blue", weight: 5 }] },
      addWaypoints: false,
      draggableWaypoints: false,
      showAlternatives: false,
      routeWhileDragging: false,
      fitSelectedRoutes: true,
      router: L.Routing.openrouteservice("API_KEY_HERE", {
        profile: "driving-car",
      }),
    }).addTo(map);

    map._routingControl = routingControl;

    return () => {
      if (map._routingControl) {
        map.removeControl(map._routingControl);
        map._routingControl = null;
      }
    };
  }, [coords, map]);

  return null;
}
*/
