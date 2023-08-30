import React from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [24, 36],
    iconAnchor: [12, 36]
});

L.Marker.prototype.options.icon = DefaultIcon;


const Map = ({ position, height, zoom, scrollWheelZoom }) => {
    return (
        <MapContainer center={position} zoom={zoom} scrollWheelZoom={scrollWheelZoom} style={{ width: "100%", height: height }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
                <Popup>
                    Your Location
                </Popup>
            </Marker>
        </MapContainer>
    );
}

export default Map;