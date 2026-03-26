import React, { useState, useEffect } from 'react';
import { Map, MapPin, Truck, Leaf, CloudRain, Clock, Play } from 'lucide-react';

const Sidebar = ({
  pickup, setPickup,
  delivery, setDelivery,
  handleSearch,
  routes,
  selectedRoute, setSelectedRoute,
  startJourney
}) => {
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [deliverySuggestions, setDeliverySuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async (query, type) => {
      if (!query || query.length < 3) {
        if (type === 'pickup') setPickupSuggestions([]);
        if (type === 'delivery') setDeliverySuggestions([]);
        return;
      }
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (type === 'pickup') setPickupSuggestions(data);
        if (type === 'delivery') setDeliverySuggestions(data);
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      if (activeInput === 'pickup') fetchSuggestions(pickup, 'pickup');
      if (activeInput === 'delivery') fetchSuggestions(delivery, 'delivery');
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [pickup, delivery, activeInput]);

  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col h-full shadow-lg z-20">
      <div className="p-6 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2 mb-6 text-green-600">
          <Leaf className="w-6 h-6" />
          <h2 className="text-2xl font-bold tracking-tight">Ecologix</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">Pickup Location</label>
            <div className="relative">
               <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
               <input 
                 value={pickup} 
                 onChange={(e) => { setPickup(e.target.value); setActiveInput('pickup'); }}
                 onFocus={() => setActiveInput('pickup')}
                 onKeyDown={(e) => { if (e.key === 'Enter') { handleSearch(); setActiveInput(null); } }}
                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow" 
                 placeholder="Enter pickup"
               />
               {activeInput === 'pickup' && pickupSuggestions.length > 0 && (
                 <ul className="absolute z-30 w-full bg-white mt-1 border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                   {pickupSuggestions.map((s, i) => (
                     <li 
                       key={i} 
                       className="p-3 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0 text-sm text-gray-700"
                       onClick={() => { setPickup(s.display_name); setPickupSuggestions([]); setActiveInput(null); }}
                     >
                       {s.display_name}
                     </li>
                   ))}
                 </ul>
               )}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">Delivery Location</label>
            <div className="relative">
               <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
               <input 
                 value={delivery} 
                 onChange={(e) => { setDelivery(e.target.value); setActiveInput('delivery'); }}
                 onFocus={() => setActiveInput('delivery')}
                 onKeyDown={(e) => { if (e.key === 'Enter') { handleSearch(); setActiveInput(null); } }}
                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow" 
                 placeholder="Enter delivery destination"
               />
               {activeInput === 'delivery' && deliverySuggestions.length > 0 && (
                 <ul className="absolute z-30 w-full bg-white mt-1 border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                   {deliverySuggestions.map((s, i) => (
                     <li 
                       key={i} 
                       className="p-3 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0 text-sm text-gray-700"
                       onClick={() => { setDelivery(s.display_name); setDeliverySuggestions([]); setActiveInput(null); }}
                     >
                       {s.display_name}
                     </li>
                   ))}
                 </ul>
               )}
            </div>
          </div>
          <button 
             onClick={handleSearch}
             className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg shadow-sm transition-colors flex justify-center items-center gap-2"
          >
            <Map className="w-5 h-5" /> Generate Routes
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {routes.length > 0 ? (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-700 uppercase text-xs tracking-wider">Available Routes</h3>
            {routes.map(r => {
               const isSelected = selectedRoute?.id === r.id;
               return (
                 <div 
                   key={r.id}
                   onClick={() => setSelectedRoute(r)}
                   className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-green-500 bg-white shadow-md' : 'border-transparent bg-white shadow-sm hover:border-gray-300'}`}
                 >
                   <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold flex items-center gap-1.5" style={{color: r.color}}>
                         <div className="w-3 h-3 rounded-full" style={{backgroundColor: r.color}}></div>
                         {r.name}
                      </h4>
                      {r.risk === 'Low' && <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-bold uppercase">Best</span>}
                   </div>
                   <div className="grid grid-cols-2 gap-y-2 mt-3 text-sm">
                      <div className="flex items-center text-gray-600 gap-1"><Truck className="w-4 h-4"/> {r.distance} km</div>
                      <div className="flex items-center text-gray-600 gap-1"><Clock className="w-4 h-4"/> {r.time}</div>
                      <div className="col-span-2 flex items-center font-semibold gap-1 text-gray-800">
                        <CloudRain className="w-4 h-4 text-gray-500"/> CO₂: {r.co2} kg
                      </div>
                   </div>
                 </div>
               )
            })}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 px-4">
             <Map className="w-12 h-12 mb-3 opacity-20" />
             <p className="text-sm">Enter locations and click "Generate Routes" to compare paths.</p>
          </div>
        )}
      </div>

      {selectedRoute && (
         <div className="p-6 border-t border-gray-200 bg-white shrink-0">
            <button 
               onClick={startJourney}
               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-colors flex justify-center items-center gap-2 text-lg"
            >
              <Play className="w-5 h-5 fill-current" /> Start Journey
            </button>
         </div>
      )}
    </aside>
  );
};

export default Sidebar;
