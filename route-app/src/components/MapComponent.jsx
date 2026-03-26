import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Delivery Truck Icon
const truckHtml = `<div style="background-color: white; border-radius: 50%; padding: 4px; border: 2px solid #2563eb; box-shadow: 0 2px 4px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg></div>`;

const truckIcon = L.divIcon({
  html: truckHtml,
  className: 'truck-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

// Component to handle auto-fitting bounds based on active routes
const ChangeMapView = ({ routes }) => {
  const map = useMap();
  useEffect(() => {
    if (routes && routes.length > 0) {
      // Collect all points to fit the map
      const allPoints = routes.flatMap(r => r.path);
      if(allPoints.length > 0) {
        map.fitBounds(allPoints, { padding: [50, 50] });
      }
    }
  }, [routes, map]);
  return null;
};

const MapComponent = ({ routes, selectedRoute, vehiclePosition }) => {
  const defaultCenter = [39.8283, -98.5795]; // Center of USA

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={4} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        <ChangeMapView routes={routes} />

        {/* Render all route polylines */}
        {routes.map(route => {
          const isSelected = selectedRoute?.id === route.id;
          return (
            <Polyline
              key={route.id}
              positions={route.path}
              pathOptions={{
                color: route.color,
                weight: isSelected ? 8 : 4,
                opacity: isSelected ? 1 : 0.4,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            >
              <Popup>
                <div className="font-sans">
                  <strong>{route.name}</strong><br/>
                  CO₂: {route.co2} kg<br/>
                  Dist: {route.distance} km
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {/* Render animated vehicle marker */}
        {vehiclePosition && (
          <Marker position={vehiclePosition} icon={truckIcon}>
            <Popup>Active Delivery Vehicle</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
