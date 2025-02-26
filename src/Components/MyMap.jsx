import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import "./MyMap.css"; // Import the CSS file

// Fix default marker icon issue
const defaultIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [35, 50], // Bigger size for better visibility
  iconAnchor: [17, 50],
});

const MyMap = () => {
  const pune = [18.5204, 73.8567]; // Pune Location
  const talegaon = [18.7350, 73.6756]; // Talegaon Location

  return (
    <div className="map-wrapper">
      <h2 className="map-title">Pune & Talegaon Interactive Map</h2>
      <MapContainer center={[18.6, 73.76]} zoom={10} className="map-container">
        {/* OpenStreetMap Tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Pune Marker */}
        <Marker position={pune} icon={defaultIcon}>
          <Popup><span className="popup-text">📍 Pune, Maharashtra</span></Popup>
        </Marker>

        {/* Talegaon Marker */}
        <Marker position={talegaon} icon={defaultIcon}>
          <Popup><span className="popup-text">📍 Talegaon, Maharashtra</span></Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MyMap;
