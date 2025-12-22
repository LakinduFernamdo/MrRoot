import { Polyline } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RealRoute({ from, to }) {
  const [route, setRoute] = useState([]);

  useEffect(() => {
    if (!from || !to) return;

    const fetchRoute = async () => {
      try {
        // OpenRouteService example
        const res = await axios.get(
          "https://api.openrouteservice.org/v2/directions/driving-car",
          {
            params: {
              start: `${from.lng},${from.lat}`,
              end: `${to.lng},${to.lat}`
            },
            headers: {
              Authorization: "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImMyM2ZhMmI4ZDIxYTQ3MjdiMjE0ZjRmZGYxM2FmNzFjIiwiaCI6Im11cm11cjY0In0="
            }
          }
        );

        const coords = res.data.features[0].geometry.coordinates
          .map(c => [c[1], c[0]]); // lng,lat → lat,lng

        setRoute(coords);
      } catch (err) {
        console.error("Route fetch error:", err);
      }
    };

    fetchRoute();
  }, [from, to]);

  if (route.length === 0) return null;

  return (
    <Polyline
      positions={route}
      pathOptions={{
        color: "#27B03CA9",
        weight: 6,
        opacity: 0.9
      }}
    />
  );
}
