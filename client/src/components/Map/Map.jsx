import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

const MapComponent = () => {
  const mapRef = useRef(null);
  const [routeControl, setRouteControl] = useState(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current.leafletElement;

      const startPoint = [51.505, -0.09]; // Starting point
      const endPoint = [51.51, -0.1];    // Ending point

      // Create a Leaflet map
      const leafletMap = L.map(map).setView(startPoint, 13);

      // Add a base map layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(leafletMap);

      // Add a marker at the starting point
      const startMarker = L.marker(startPoint).addTo(leafletMap);
      startMarker.bindPopup('Starting Point');

      // Add a marker at the ending point
      const endMarker = L.marker(endPoint).addTo(leafletMap);
      endMarker.bindPopup('Ending Point');

      // Create a routing control
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(startPoint),
          L.latLng(endPoint)
        ],
        routeWhileDragging: true
      });

      routingControl.addTo(leafletMap);

      // Set the routing control state
      setRouteControl(routingControl);
    }
  }, []);

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '400px', width: '100%' }} ref={mapRef}>
      <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
      {routeControl}
    </MapContainer>
  );
};

export default MapComponent;