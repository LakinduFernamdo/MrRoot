export function harversineDistance(coord1, coord2) {

    const toRad = (value) => (value * Math.PI) / 180; // This fuction convert to radian 
    const Radius = 6371; //Radius of earth(Km)

    const dLat = toRad(coord2.lat - coord1.lat);
    const dLng = toRad(coord2.lng - coord1.lng);

    const lat1 = toRad(coord1.lat);
    const lat2 = toRad(coord2.lat);
 
    const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Radius * c; //  final output in km


}