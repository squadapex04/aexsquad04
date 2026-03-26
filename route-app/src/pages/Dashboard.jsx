import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import MapComponent from "../components/MapComponent";
import Analytics from "../components/Analytics";

// Function to get real route using Nominatim and OSRM
const fetchRealRoute = async (pickupName, deliveryName) => {
  try {
    const pickupRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(pickupName)}&format=json&limit=1`);
    const pickupData = await pickupRes.json();
    if (!pickupData || pickupData.length === 0) {
      alert(`Pickup location "${pickupName}" was not found by the map service.`);
      return null;
    }
    const pLon = pickupData[0].lon;
    const pLat = pickupData[0].lat;

    const deliveryRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(deliveryName)}&format=json&limit=1`);
    const deliveryData = await deliveryRes.json();
    if (!deliveryData || deliveryData.length === 0) {
      alert(`Delivery location "${deliveryName}" was not found by the map service.`);
      return null;
    }
    const dLon = deliveryData[0].lon;
    const dLat = deliveryData[0].lat;

    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${pLon},${pLat};${dLon},${dLat}?overview=full&geometries=geojson&alternatives=true`;
    console.log("Fetching OSRM Route:", osrmUrl);
    
    const osrmRes = await fetch(osrmUrl);
    const osrmData = await osrmRes.json();

    if (osrmData.code !== "Ok" || !osrmData.routes || osrmData.routes.length === 0) {
      console.error("OSRM Error Data:", osrmData);
      alert("The routing service could not find a road path between these two points. They might be separated by an ocean or are inaccessible by car.");
      return null;
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
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans relative">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -ml-48 -mb-48 pointer-events-none" />

      <Sidebar 
        pickup={pickup} setPickup={setPickup}
        delivery={delivery} setDelivery={setDelivery}
        handleSearch={handleSearch}
        routes={routes}
        selectedRoute={selectedRoute}
        setSelectedRoute={setSelectedRoute}
        startJourney={startJourney}
      />
      
      <div className="flex-1 flex flex-col relative w-full h-full z-10">
        <header className="glass-panel px-10 py-5 z-20 flex justify-between items-center border-b border-white/20">
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Elite Routing Engine
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mt-1">Real-time Carbon Intelligence Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Status</span>
                <span className="text-xs font-black text-emerald-600 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Operational</span>
             </div>
             <div className="w-10 h-10 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                <Leaf className="w-5 h-5" />
             </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row min-h-0 bg-white/30 backdrop-blur-sm">
          <div className="flex-1 h-full relative overflow-hidden">
             <MapComponent 
               routes={routes} 
               selectedRoute={selectedRoute} 
               vehiclePosition={vehiclePosition} 
             />
          </div>
          <div className="w-full lg:w-[400px] glass-panel shrink-0 overflow-y-auto border-l border-white/20 p-10 h-full relative">
             <Analytics totalEmissions={totalEmissions} deliveryHistory={deliveryHistory} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
