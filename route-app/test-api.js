const pickupName = "Chicago, IL";
const deliveryName = "Detroit, MI";

async function fetchRealRoute() {
  try {
    const pickupRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(pickupName)}&format=json&limit=1`, {
      headers: { "User-Agent": "EcoRouterTest/1.0" }
    });
    const pickupData = await pickupRes.json();
    console.log("Pickup:", pickupData);

    const deliveryRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(deliveryName)}&format=json&limit=1`, {
      headers: { "User-Agent": "EcoRouterTest/1.0" }
    });
    const deliveryData = await deliveryRes.json();
    console.log("Delivery:", deliveryData);

    const pLon = pickupData[0].lon;
    const pLat = pickupData[0].lat;
    const dLon = deliveryData[0].lon;
    const dLat = deliveryData[0].lat;

    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${pLon},${pLat};${dLon},${dLat}?overview=full&geometries=geojson&alternatives=3`;
    const osrmRes = await fetch(osrmUrl);
    const osrmData = await osrmRes.json();
    console.log("OSRM Routes returned:", osrmData.routes ? osrmData.routes.length : 0);
  } catch (err) {
    console.error("Routing error:", err);
  }
}

fetchRealRoute();
