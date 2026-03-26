import React, { useState, useEffect } from 'react';
import { Map, MapPin, Truck, Leaf, CloudRain, Clock, Play, Sparkles, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-96 glass-panel border-r border-white/20 flex flex-col h-full shadow-2xl z-30 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-green-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="p-8 border-b border-white/10 shrink-0 relative">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-green-600 rounded-2xl shadow-lg shadow-green-500/30">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-gray-900 leading-none">Ecologix</h2>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-green-600/80">Premium Routing</span>
          </div>
        </div>

        <div className="space-y-5">
          <div className="group">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block mx-1">Pickup Point</label>
            <div className="relative">
               <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-green-600 transition-transform group-focus-within:scale-110" />
               <input 
                 value={pickup} 
                 onChange={(e) => { setPickup(e.target.value); setActiveInput('pickup'); }}
                 onFocus={() => setActiveInput('pickup')}
                 className="w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 focus:bg-white transition-all shadow-sm font-medium placeholder:text-gray-400" 
                 placeholder="Search pickup..."
               />
               <AnimatePresence>
                 {activeInput === 'pickup' && pickupSuggestions.length > 0 && (
                   <motion.ul 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 10 }}
                     className="absolute z-40 w-full bg-white/95 backdrop-blur-lg mt-3 border border-gray-100 rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-2"
                   >
                     {pickupSuggestions.map((s, i) => (
                       <li 
                         key={i} 
                         className="p-3.5 hover:bg-green-50 rounded-xl cursor-pointer transition-colors text-sm text-gray-700 font-medium border-b border-gray-50 last:border-0"
                         onClick={() => { setPickup(s.display_name); setPickupSuggestions([]); setActiveInput(null); }}
                       >
                         {s.display_name}
                       </li>
                     ))}
                   </motion.ul>
                 )}
               </AnimatePresence>
            </div>
          </div>

          <div className="group">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block mx-1">Destination</label>
            <div className="relative">
               <Navigation className="absolute left-3.5 top-3 w-4 h-4 text-blue-600 transition-transform group-focus-within:scale-110" />
               <input 
                 value={delivery} 
                 onChange={(e) => { setDelivery(e.target.value); setActiveInput('delivery'); }}
                 onFocus={() => setActiveInput('delivery')}
                 className="w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all shadow-sm font-medium placeholder:text-gray-400" 
                 placeholder="Search destination..."
               />
               <AnimatePresence>
                 {activeInput === 'delivery' && deliverySuggestions.length > 0 && (
                   <motion.ul 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 10 }}
                     className="absolute z-40 w-full bg-white/95 backdrop-blur-lg mt-3 border border-gray-100 rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-2"
                   >
                     {deliverySuggestions.map((s, i) => (
                       <li 
                         key={i} 
                         className="p-3.5 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors text-sm text-gray-700 font-medium border-b border-gray-50 last:border-0"
                         onClick={() => { setDelivery(s.display_name); setDeliverySuggestions([]); setActiveInput(null); }}
                       >
                         {s.display_name}
                       </li>
                     ))}
                   </motion.ul>
                 )}
               </AnimatePresence>
            </div>
          </div>

          <motion.button 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             onClick={handleSearch}
             className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-2xl shadow-xl shadow-gray-200 transition-all flex justify-center items-center gap-2 group"
          >
            <Sparkles className="w-5 h-5 text-green-400 group-hover:animate-pulse" /> Find Route
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        <AnimatePresence mode="wait">
          {routes.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-5"
            >
              <h3 className="font-extrabold text-gray-400 uppercase text-[10px] tracking-[0.2em] mb-2">Exclusive Path Suggestions</h3>
              {routes.map((r, i) => {
                 const isSelected = selectedRoute?.id === r.id;
                 return (
                   <motion.div 
                     initial={{ x: -20, opacity: 0 }}
                     animate={{ x: 0, opacity: 1 }}
                     transition={{ delay: i * 0.1 }}
                     key={r.id}
                     onClick={() => setSelectedRoute(r)}
                     className={`p-5 rounded-2xl border-2 transition-all relative overflow-hidden glass-card ${isSelected ? 'border-green-500 ring-4 ring-green-500/5' : 'border-transparent'}`}
                   >
                     {isSelected && <motion.div layoutId="active-pill" className="absolute top-0 right-0 p-1.5 bg-green-500 rounded-bl-xl"><Sparkles className="w-3 h-3 text-white"/></motion.div>}
                     <div className="flex justify-between items-start mb-3">
                        <h4 className="font-black text-sm flex items-center gap-2" style={{color: r.color}}>
                           <div className="w-2.5 h-2.5 rounded-full ring-4 ring-offset-2 ring-transparent" style={{backgroundColor: r.color, boxShadow: `0 0 10px ${r.color}`}}></div>
                           {r.name}
                        </h4>
                        {r.risk === 'Low' && <span className="bg-green-500 text-white text-[9px] px-2 py-1 rounded-lg font-black uppercase tracking-tighter">Elite</span>}
                     </div>
                     <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Distance</span>
                          <span className="text-gray-700 font-black flex items-center gap-1.5 mt-0.5"><Truck className="w-3.5 h-3.5 text-gray-400"/> {r.distance}km</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Est. Time</span>
                          <span className="text-gray-700 font-black flex items-center gap-1.5 mt-0.5"><Clock className="w-3.5 h-3.5 text-gray-400"/> {r.time}</span>
                        </div>
                        <div className="col-span-2 pt-3 border-t border-gray-100 flex items-center justify-between">
                           <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Footprint Reduction</span>
                              <span className="text-emerald-600 font-black text-lg flex items-center gap-1.5 mt-0.5"><CloudRain className="w-4 h-4"/> {r.co2}kg <span className="text-xs text-gray-300 font-medium">CO₂</span></span>
                           </div>
                           {isSelected && <div className="p-2 bg-green-50 rounded-xl"><Leaf className="w-4 h-4 text-green-600"/></div>}
                        </div>
                     </div>
                   </motion.div>
                 )
              })}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center py-20"
            >
               <div className="w-20 h-20 bg-gray-100 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner relative">
                  <Map className="w-10 h-10 text-gray-300" />
                  <div className="absolute inset-0 border-2 border-dashed border-gray-200 rounded-[2.5rem] animate-spin-slow" style={{animationDuration: '10s'}} />
               </div>
               <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">Ready For Departure</p>
               <p className="text-xs text-gray-400 mt-2 max-w-[200px] leading-relaxed">Enter your route parameters above to unlock precision carbon analytics.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedRoute && (
           <motion.div 
             initial={{ y: 100 }}
             animate={{ y: 0 }}
             exit={{ y: 100 }}
             className="p-8 border-t border-white/20 glass-panel shrink-0 relative"
           >
              <motion.button 
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={startJourney}
                 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4.5 rounded-2xl shadow-2xl shadow-blue-500/20 transition-all flex justify-center items-center gap-3 text-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Play className="w-6 h-6 fill-current text-white/90" /> Initiate Journey
              </motion.button>
           </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};

export default Sidebar;
