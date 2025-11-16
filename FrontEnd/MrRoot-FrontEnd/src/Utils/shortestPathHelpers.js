

export function buildOrderedNodeList(shortest) {
  return ["You", ...shortest.map((p) => p.to)];
}

export function convertNodesToCoordinates(orderedNodes, markers, userLocation) {
  return orderedNodes.map((name) => {
    if (name === "You") {
      return [userLocation.lat, userLocation.lng];
    }

    const marker = markers.find((m) => m.name === name);
    if (!marker) return null;

    return [marker.position.lat, marker.position.lng];
  }).filter(Boolean);
}
