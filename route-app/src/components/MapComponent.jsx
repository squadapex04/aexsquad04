import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const deliveryIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const vehicleIcon = new L.DivIcon({
  html: `<div class="w-10 h-10 bg-blue-600 rounded-full border-4 border-white shadow-2xl flex items-center justify-center animate-pulse">
            <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
         </div>`,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

// Component to handle map view bounds
function ChangeView({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) map.fitBounds(bounds, { padding: [100, 100], duration: 1.5 });
  }, [bounds, map]);
  return null;
}

const MapComponent = ({ routes, selectedRoute, vehiclePosition }) => {
  const defaultCenter = [41.8781, -87.6298]; // Chicago
  
  let bounds = null;
  if (selectedRoute && selectedRoute.path && selectedRoute.path.length > 0) {
    bounds = L.latLngBounds(selectedRoute.path);
  }

  return (
    <div className="w-full h-full relative group transition-all duration-700">
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none z-[1000]" />
      
      <MapContainer 
        center={defaultCenter} 
        zoom={12} 
        className="w-full h-full z-0 grayscale-[0.2] contrast-[1.1]"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {bounds && <ChangeView bounds={bounds} />}

        {routes.map(r => (
          <Polyline 
            key={r.id}
            positions={r.path} 
            color={r.color} 
            weight={selectedRoute?.id === r.id ? 8 : 4}
            opacity={selectedRoute?.id === r.id ? 0.9 : 0.2}
            lineCap="round"
            lineJoin="round"
          />
        ))}

        {selectedRoute && selectedRoute.path.length > 0 && (
          <>
            <Marker position={selectedRoute.path[0]} icon={pickupIcon}>
              <Popup>Pickup Location</Popup>
            </Marker>
            <Marker position={selectedRoute.path[selectedRoute.path.length - 1]} icon={deliveryIcon}>
              <Popup>Delivery Destination</Popup>
            </Marker>
          </>
        )}

        {vehiclePosition && (
          <Marker position={vehiclePosition} icon={vehicleIcon} zIndexOffset={100} />
        )}
      </MapContainer>

      {/* Floating Zoom Controls Design */}
      <div className="absolute bottom-10 right-10 z-[1000] flex flex-col gap-2">
         <div className="p-2 border border-white/20 glass-panel rounded-2xl shadow-2xl flex flex-col gap-1 items-center justify-center">
            <button className="w-10 h-10 hover:bg-white/40 rounded-xl flex items-center justify-center transition-colors text-gray-700 font-black">+</button>
            <div className="w-6 h-[1px] bg-gray-200" />
            <button className="w-10 h-10 hover:bg-white/40 rounded-xl flex items-center justify-center transition-colors text-gray-700 font-black">-</button>
         </div>
      </div>
    </div>
  );
};

export default MapComponent;
