import React, { useMemo, useState, useRef } from 'react';
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


const center = {
    lat: 44.4949,
    lng: 11.3426,
}


const Map = ({ position, height, zoom, scrollWheelZoom, dragging, draggableMarker, draggableEventHandler, markerRef }) => {
    //const markerRef = useRef(null);
    const [positionn, setPositionn] = useState(center);
    const markerEventHandler = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    //console.log(marker.getLatLng());
                    setPositionn(marker.getLatLng());
                }
            },
        }),
        [],
    );
    return (
        <MapContainer center={position} dragging={dragging} zoom={zoom} scrollWheelZoom={scrollWheelZoom} style={{ width: "100%", height: height }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {draggableMarker ? (
                <>
                    <Marker
                        draggable={draggableMarker}
                        eventHandlers={markerEventHandler}
                        position={positionn}
                        ref={markerRef}
                    ></Marker>
                </>
            ) : (
                <>
                    <Marker
                        draggable={draggableMarker}
                        position={position}
                    ></Marker>
                </>
            )}
        </MapContainer>
    );
}

export default Map;