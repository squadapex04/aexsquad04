import React from 'react';
import { BarChart3, TrendingDown, Leaf, History, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Analytics = ({ totalEmissions, deliveryHistory = [] }) => {
  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="shrink-0">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-6">Real-Time Impact</h3>
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 rounded-[2rem] bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-2xl shadow-emerald-200 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4">
             <Leaf className="w-32 h-32 rotate-12" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Total CO₂ Saved</span>
            </div>
            <div className="flex items-baseline gap-2">
              <motion.span 
                key={totalEmissions}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-5xl font-black"
              >
                {totalEmissions.toFixed(1)}
              </motion.span>
              <span className="text-xl font-bold opacity-60">kg</span>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
               <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Eco Rank</span>
                  <span className="text-sm font-black mt-1">Forest Guardian</span>
               </div>
               <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <ArrowUpRight className="w-5 h-5" />
               </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">Emission History</h3>
          <History className="w-4 h-4 text-gray-300" />
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          <AnimatePresence>
            {deliveryHistory.length > 0 ? (
              deliveryHistory.slice().reverse().map((item, idx) => (
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx}
                  className="p-5 glass-card rounded-2xl border border-white/40 flex items-center justify-between group"
                >
                  <div className="flex flex-col gap-1 max-w-[180px]">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                      <span className="text-xs font-black text-gray-800 truncate">{item.to || 'Unknown'}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold ml-3.5 truncate">From: {item.from || 'Origin'}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-emerald-600 font-black text-sm">-{item.co2}kg</span>
                    <span className="text-[8px] font-black uppercase tracking-tighter text-gray-300 group-hover:text-emerald-400 transition-colors">Clean Run</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-40">
                <BarChart3 className="w-10 h-10 mb-4 text-gray-300" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">No Historical Data</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-auto pt-6 shrink-0">
        <div className="p-4 bg-gray-900 rounded-2xl flex items-center gap-4 border border-white/5 shadow-2xl">
           <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
              <Leaf className="w-6 h-6 text-orange-500" />
           </div>
           <div>
              <p className="text-white text-xs font-black">Daily Goal</p>
              <div className="w-40 h-1.5 bg-white/5 rounded-full mt-1.5 overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    className="h-full bg-orange-500" 
                 />
              </div>
           </div>
           <span className="ml-auto text-white font-black text-xs">65%</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
