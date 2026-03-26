import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Cloud, AlertTriangle } from 'lucide-react';

const Analytics = ({ totalEmissions, deliveryHistory = [] }) => {
  const chartData = deliveryHistory.length > 0 
    ? deliveryHistory.map((d, i) => ({ trip: `Trip ${i+1}`, emissions: d.co2 }))
    : [{ trip: 'No trips', emissions: 0 }];

  const sortedByPollution = [...deliveryHistory].sort((a, b) => b.co2 - a.co2).slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Cloud className="text-blue-500" /> Total Impact
        </h3>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
          <p className="text-sm text-blue-800 font-semibold mb-1 uppercase tracking-wide">Session CO₂ Emissions</p>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-black text-blue-900">{totalEmissions.toFixed(1)}</span>
            <span className="text-xl font-bold text-blue-700 mb-1">kg</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Emissions Per Trip</h3>
        <div className="h-48 w-full bg-white rounded-xl border border-gray-100 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="trip" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
              <Tooltip 
                cursor={{fill: '#F3F4F6'}} 
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} 
              />
              <Bar dataKey="emissions" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
          <AlertTriangle className="text-red-500 w-5 h-5" /> Highest Emission Trips
        </h3>
        <div className="space-y-3">
          {sortedByPollution.length > 0 ? sortedByPollution.map((route, idx) => (
             <div key={idx} className="flex justify-between items-center p-3 bg-red-50 border border-red-100 rounded-xl">
               <div className="text-sm">
                  <p className="font-semibold text-gray-800">{route.from}</p>
                  <p className="text-xs text-red-600 font-medium">&rarr; {route.to}</p>
               </div>
               <div className="font-bold text-red-700">
                  {route.co2.toFixed(1)} <span className="text-xs">kg</span>
               </div>
             </div>
          )) : (
             <div className="text-sm text-gray-500 text-center py-4 border border-dashed rounded-xl">
               No trips completed in this session yet.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
