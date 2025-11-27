// src/Utils/shortestPathHelpers.js
// Converts ordered node-name array to coordinates list
// orderedNodes: e.g. ["You", "A", "B", "You"]
// markers: array of marker objects [{ id, name, position: {lat,lng} }, ...]
// userPos: { lat, lng }

export function convertNodesToCoordinates(orderedNodes = [], markers = [], userPos) {
  const coords = [];
  const lookup = {};
  markers.forEach(m => {
    lookup[m.name] = m.position;
  });

  for (const node of orderedNodes) {
    if (node === "You") {
      coords.push([userPos.lat, userPos.lng]);
    } else if (lookup[node]) {
      coords.push([lookup[node].lat, lookup[node].lng]);
    } else {
      // fallback: ignore unknown nodes
      console.warn("Unknown node name in orderedNodes:", node);
    }
  }
  return coords;
}
