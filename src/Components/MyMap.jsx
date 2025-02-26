import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import "./MyMap.css";

// Default marker
const defaultIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
});

const LocationSearch = ({ from, to, setFrom, setTo, swapLocations, searchLocations }) => (
  <div className="controls">
    <input type="text" placeholder="Enter From Location" value={from} onChange={(e) => setFrom(e.target.value)} />
    <button className="swap-btn" onClick={swapLocations}>🔄</button>
    <input type="text" placeholder="Enter To Location" value={to} onChange={(e) => setTo(e.target.value)} />
    <button className="search-btn" onClick={searchLocations}>Search</button>
  </div>
);

const MyMap = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState(null);

  const getCoordinates = async (location) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${location}`;
    try {
      const response = await axios.get(url);
      if (response.data.length > 0) {
        return {
          lat: parseFloat(response.data[0].lat),
          lon: parseFloat(response.data[0].lon),
        };
      }
      return null;
    } catch {
      return null;
    }
  };

  const getDistance = async (fromCoords, toCoords) => {
    const url = `https://router.project-osrm.org/route/v1/driving/${fromCoords.lon},${fromCoords.lat};${toCoords.lon},${toCoords.lat}?overview=false`;
    try {
      const response = await axios.get(url);
      if (response.data.routes.length > 0) {
        return (response.data.routes[0].distance / 1000).toFixed(2); // Convert meters to km
      }
    } catch {
      return null;
    }
  };

  const searchLocations = async () => {
    if (!from || !to) return alert("Please enter both locations!");
    setLoading(true);

    const fromLocation = await getCoordinates(from);
    const toLocation = await getCoordinates(to);

    if (!fromLocation || !toLocation) {
      setLoading(false);
      return alert("Could not find one or both locations. Try again!");
    }

    setFromCoords(fromLocation);
    setToCoords(toLocation);
    const calculatedDistance = await getDistance(fromLocation, toLocation);
    setDistance(calculatedDistance);
    setLoading(false);
  };

  const swapLocations = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="map-wrapper">
      <h2 className="map-title">Find Distance Between Locations</h2>
      <LocationSearch from={from} to={to} setFrom={setFrom} setTo={setTo} swapLocations={swapLocations} searchLocations={searchLocations} />
      {loading && <p>Loading map...</p>}
      {fromCoords && toCoords && (
        <>
          <MapContainer center={[fromCoords.lat, fromCoords.lon]} zoom={10} className="map-container">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
            <Marker position={[fromCoords.lat, fromCoords.lon]} icon={defaultIcon}>
              <Popup>📍 {from}</Popup>
            </Marker>
            <Marker position={[toCoords.lat, toCoords.lon]} icon={defaultIcon}>
              <Popup>📍 {to}</Popup>
            </Marker>
          </MapContainer>
          <p className="distance-text">Distance: {distance ? `${distance} km` : "Calculating..."}</p>
        </>
      )}
    </div>
  );
};

export default MyMap;
