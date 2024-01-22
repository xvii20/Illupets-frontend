import React from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

export const MyMapComponent = ({ closeModal }) => {
  // Use a unique key based on the closeModal prop. needed to rerender the map
  const mapKey = closeModal ? 'closed' : 'open';

  return (
    <MapContainer
      key={mapKey}
      style={{ width: closeModal ? '100%' : '60%', height: '100vh' }}
      zoom={13}
      center={[51.505, -0.09]}
      scrollWheelZoom={false}
      fadeAnimation={true}
      markerZoomAnimation={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};
