// src/Utils/shortestPathHelpers.js

/**
 * Sort backend shortest object into ordered node names by ascending distance.
 * Example input: { You: 0.0, A: 10.5, B: 22.1 }
 * Returns: ["You","A","B"]
 */
export function extractOrderedNodes(shortestObj = {}) {
  if (!shortestObj || typeof shortestObj !== "object") return [];
  return Object.entries(shortestObj)
    .sort((a, b) => a[1] - b[1])
    .map(entry => entry[0]);
}

/**
 * Convert ordered node names to coordinate objects.
 * - markers: array of { id, name, position: { lat, lng } }
 * - userPos: { lat, lng }
 *
 * Returns an array of { lat, lng } or null for unknown nodes so the caller can handle them.
 */
export function convertNodesToCoordinates(orderedNodes = [], markers = [], userPos = { lat: null, lng: null }) {
  const lookup = {};
  markers.forEach(m => {
    // normalize keys by trimming whitespace
    if (m && m.name) lookup[m.name.trim()] = m.position;
  });

  const coords = [];
  for (const node of orderedNodes) {
    const clean = node && typeof node === "string" ? node.trim() : node;
    if (clean === "You") {
      coords.push({ lat: userPos.lat, lng: userPos.lng });
    } else if (lookup[clean]) {
      coords.push({ lat: lookup[clean].lat, lng: lookup[clean].lng });
    } else {
      // push a null placeholder to preserve ordering (prevents misalignment and NaN)
      console.warn("Unknown node from backend (no matching marker):", clean);
      coords.push(null);
    }
  }

  return coords;
}
