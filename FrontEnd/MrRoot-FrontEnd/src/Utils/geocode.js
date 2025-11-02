export async function reverseGeocode(lat, lng) {

    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

    try {
        const res = await fetch(url, {
            headers: {
                "User-Agent": "Leaflet-React-Distance-App"
            }
        });

        const data = await res.json();
        return data.address?.suburb ||
            data.address?.town ||
            data.address?.city ||
            data.address?.village ||
            data.address?.county ||
            data.display_name ||
            "Unknown Location";

    } catch (error) {
        console.error("Geocode error:", err);
        return "Unknown Location";
    }

}