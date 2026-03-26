import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import MapComponent from "../components/MapComponent";
import Analytics from "../components/Analytics";

// Function to get real route using Nominatim and OSRM
const fetchRealRoute = async (pickupName, deliveryName) => {
  try {
    const pickupRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(pickupName)}&format=json&limit=1`);
    const pickupData = await pickupRes.json();
    if (!pickupData || pickupData.length === 0) throw new Error("Pickup location not found");
    const pLon = pickupData[0].lon;
    const pLat = pickupData[0].lat;

    const deliveryRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(deliveryName)}&format=json&limit=1`);
    const deliveryData = await deliveryRes.json();
    if (!deliveryData || deliveryData.length === 0) throw new Error("Delivery location not found");
    const dLon = deliveryData[0].lon;
    const dLat = deliveryData[0].lat;

    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${pLon},${pLat};${dLon},${dLat}?overview=full&geometries=geojson&alternatives=true`;
    const osrmRes = await fetch(osrmUrl);
    const osrmData = await osrmRes.json();

    if (osrmData.code !== "Ok" || !osrmData.routes || osrmData.routes.length === 0) {
      throw new Error("Route not found");
    }

    const routeBase = osrmData.routes[0];
    const pathBase = routeBase.geometry.coordinates.map(coord => [coord[1], coord[0]]);
    const distKm = (routeBase.distance / 1000);
    const timeMin = Math.round(routeBase.duration / 60);

    const routeMedium = osrmData.routes[1];
    const pathMedium = routeMedium ? routeMedium.geometry.coordinates.map(coord => [coord[1], coord[0]]) : pathBase;

    const routeEco = osrmData.routes[2];
    const pathEco = routeEco ? routeEco.geometry.coordinates.map(coord => [coord[1], coord[0]]) : pathBase;

    return [
      {
        id: "route-eco",
        name: "Eco Route (Lesser Carbon)",
        distance: distKm.toFixed(2),
        time: `${Math.round(timeMin * 1.15)} min`,
        co2: (distKm * 0.10).toFixed(2),
        color: "#10b981", // green
        risk: "Low",
        path: pathEco
      },
      {
        id: "route-balanced",
        name: "Balanced Route (Medium Carbon)",
        distance: distKm.toFixed(2),
        time: `${timeMin} min`,
        co2: (distKm * 0.14).toFixed(2),
        color: "#f59e0b", // yellow
        risk: "Medium",
        path: pathMedium
      },
      {
        id: "route-fast",
        name: "Fast Route (Most Carbon)",
        distance: distKm.toFixed(2),
        time: `${Math.round(timeMin * 0.85)} min`,
        co2: (distKm * 0.19).toFixed(2),
        color: "#ef4444", // red
        risk: "High",
        path: pathBase
      }
    ];
  } catch (err) {
    console.error("Routing error:", err);
    return null;
  }
};

function Dashboard() {
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [vehiclePosition, setVehiclePosition] = useState(null);
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!pickup || !delivery) {
      alert("Please enter both pickup and delivery locations.");
      return;
    }
    
    setIsLoading(true);
    let newRoutes = await fetchRealRoute(pickup, delivery);
    
    if (!newRoutes) {
      alert("Could not find real-time route. Please check the addresses and try again.");
      setIsLoading(false);
      return;
    }
    
    setRoutes(newRoutes);
    setSelectedRoute(newRoutes[0]);
    if (newRoutes[0].path.length > 0) {
      setVehiclePosition(newRoutes[0].path[0]);
    }
    setIsLoading(false);
  };

  const [locationWatchId, setLocationWatchId] = useState(null);
  const [isJourneyActive, setIsJourneyActive] = useState(false);

  const startJourney = () => {
    if (!selectedRoute) return;
    
    alert("Simulation Started! The vehicle will now autonomously trace your chosen route.");
    setIsJourneyActive(true);
    
    let step = 0;
    const path = selectedRoute.path;
    
    if (path && path.length > 0) {
      setVehiclePosition(path[0]);
      
      if (locationWatchId) clearInterval(locationWatchId);
      
      const interval = setInterval(() => {
        step += 4; // Rendering frames animation speed
        if (step >= path.length) {
          setVehiclePosition(path[path.length - 1]);
          clearInterval(interval);
          
          setTotalEmissions(prev => prev + parseFloat(selectedRoute.co2));
          setDeliveryHistory(prev => [...prev, {
            from: pickup,
            to: delivery,
            co2: parseFloat(selectedRoute.co2)
          }]);

          alert("Delivery successfully arrived at the destination! Your emission analytics have been updated.");
          setIsJourneyActive(false);
        } else {
          setVehiclePosition(path[step]);
        }
      }, 50); // Frame tick length
      
      setLocationWatchId(interval);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar 
        pickup={pickup} setPickup={setPickup}
        delivery={delivery} setDelivery={setDelivery}
        handleSearch={handleSearch}
        routes={routes}
        selectedRoute={selectedRoute}
        setSelectedRoute={setSelectedRoute}
        startJourney={startJourney}
      />
      <div className="flex-1 flex flex-col relative w-full h-full">
        <header className="bg-white shadow px-6 py-4 z-10">
          <h1 className="text-xl font-bold text-gray-800">Ecologix Delivery Routing</h1>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row min-h-0">
          <div className="flex-1 h-full relative border-r border-gray-200">
             <MapComponent 
               routes={routes} 
               selectedRoute={selectedRoute} 
               vehiclePosition={vehiclePosition} 
             />
          </div>
          <div className="w-full lg:w-96 bg-white shrink-0 overflow-y-auto border-l border-gray-200 p-6 z-10 h-full">
             <Analytics totalEmissions={totalEmissions} deliveryHistory={deliveryHistory} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
