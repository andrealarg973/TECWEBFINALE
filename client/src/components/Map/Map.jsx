import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import './stile.css'


let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [24, 36],
    iconAnchor: [12, 36]
});



L.Marker.prototype.options.icon = DefaultIcon;
//console.log(L);
//L.Routing.control.minimize();

const Map = ({ position, height, zoom, scrollWheelZoom, dragging, draggableMarker, markerRef, notPathMap }) => {
    /*const map = useMap();

    useEffect(() => {
        return () => {
            // Cleanup operations (e.g., remove event listeners, layers)
            //map.removeLayer(L.marker(waypoints[0]).addTo(map));
            if (notPathMap) {
                map.removeLayer(L.marker(position[0], position[1]));
            } else {
                for (let i = 0; i < position.length; i += 2) {
                    map.removeLayer(L.marker(position[i], position[i+1]));
                }
            }
        };
    }, [map]);*/

    if (notPathMap) {
        return (
            <MapContainer center={position} dragging={dragging} zoom={zoom} scrollWheelZoom={scrollWheelZoom} style={{ width: "100%", height: height }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    draggable={draggableMarker}
                    position={position}
                    ref={markerRef}
                ></Marker>
            </MapContainer>
        );
    } else {
        const waypoints = [];
        for (let i = 0; i < position.length; i += 2) {
            waypoints.push(L.latLng(position[i], position[i + 1]));
        }

        return (
            <MapContainer center={waypoints[0]} dragging={dragging} zoom={zoom} scrollWheelZoom={scrollWheelZoom} style={{ width: '100%', height }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RoutingMachine waypoints={waypoints} />
            </MapContainer>
        );
    }

}


const RoutingMap = ({ position, height, zoom }) => {
    const waypoints = [];
    for (let i = 0; i < position.length; i += 2) {
        waypoints.push(L.latLng(position[i], position[i + 1]));
    }

    return (
        <MapContainer center={waypoints[0]} zoom={zoom} style={{ width: '100%', height }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <RoutingMachine waypoints={waypoints} />
        </MapContainer>
    );
};

const RoutingMachine = ({ waypoints }) => {
    const map = useMap();

    useEffect(() => {
        const control = L.Routing.control({
            fitSelectedRoutes: true,
            draggableWaypoints: false,
            waypoints,
        }).addTo(map);

        return () => {
            // Cleanup operations
            if (control.getPlan()) {
                control.getPlan().setWaypoints([]); // Clear waypoints
                map.removeControl(control);
            }
        };
    }, [waypoints, map]);

    return null;
};

//export default RoutingMap;


export default Map;
