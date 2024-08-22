import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvent } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import car1 from "./assets/Car1.png";

function Maps() {
  const [position, setPosition] = useState([30.704649, 76.717873]);
  const [path, setPath] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [shouldTrackCar, setShouldTrackCar] = useState(true);
  const [dateRange, setDateRange] = useState("");

  const fetchPathData = async (dateRange) => {
    try {
      const response = await fetch(`http://localhost:5000/get-path?dateRange=${dateRange}`);
      const data = await response.json();
      const formattedPath = data.path.map((p) => [p.latitude, p.longitude]);
      setPath(formattedPath);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Error fetching path data:", error);
    }
  };

  const calculateRotation = (prevPos, currPos) => {
    const angle = Math.atan2(currPos[1] - prevPos[1], currPos[0] - prevPos[0]) * (90 / Math.PI);
    return angle;
  };

  const moveMarker = () => {
    if (currentIndex < path.length - 1) {
      const nextIndex = currentIndex + 1;
      const newPosition = path[nextIndex];

      const newRotation = calculateRotation(path[currentIndex], newPosition);
      setRotation(newRotation);
      setPosition(newPosition);
      setCurrentIndex(nextIndex);

      if (shouldTrackCar && hasMovedSignificantly(position, newPosition)) {
        setShouldTrackCar(false);
      }
    }
  };

  const hasMovedSignificantly = (prevPos, currPos) => {
    const distance = calculateDistance(prevPos, currPos);
    return distance > 1000;
  };

  const calculateDistance = (coord1, coord2) => {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (path.length > 0) {
      const intervalId = setInterval(() => {
        moveMarker();
        sendLocationToBackend(position[0], position[1]);
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [currentIndex, path, position]);

  const sendLocationToBackend = (latitude, longitude) => {
    const data = {
      latitude: latitude,
      longitude: longitude,
      timestamp: new Date().toISOString(),
    };

    fetch("http://localhost:5000/update-location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => console.log("Success:", data))
      .catch((error) => console.error("Error:", error));
  };

  const handleDateRangeChange = (e) => {
    const selectedRange = e.target.value;
    setDateRange(selectedRange);
  };

  return (
    <MapContainer
      center={position}
      zoom={17}
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {path.length > 0 && <Polyline positions={path} color="blue" />}
      <CarMarker
        position={position}
        rotation={rotation}
        car1={car1}
        shouldTrackCar={shouldTrackCar}
        dateRange={dateRange}
        handleDateRangeChange={handleDateRangeChange}
        fetchPathData={fetchPathData}
      />
      <ClickHandler />
    </MapContainer>
  );
}

function CarMarker({
  position,
  rotation,
  car1,
  shouldTrackCar,
  dateRange,
  handleDateRangeChange,
  fetchPathData,
}) {
  const map = useMap();

  useEffect(() => {
    if (shouldTrackCar) {
      map.setView(position, map.getZoom());
    }
  }, [position, shouldTrackCar, map]);

  const handleStartMovement = () => {
    if (dateRange) {
      fetchPathData(dateRange);
      map.closePopup(); // Close the popup when movement starts
    }
  };

  return (
    <Marker
      position={position}
      icon={L.divIcon({
        className: "custom-icon",
        html: `<img src=${car1} style="transform: rotate(${rotation}deg); width: 40px; height: 40px;" />`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      })}
    >
      <Popup>
        <div>
          <strong>Vehicle Location</strong> <br />
          Latitude: {position[0]} <br />
          Longitude: {position[1]} <br />
          <strong>Status:</strong> Moving <br />
          <strong>Speed:</strong> 20 km/h
          <br />
          <label htmlFor="dateRange">Select Date Range: </label>
          <select id="dateRange" value={dateRange} onChange={handleDateRangeChange}>
            <option value="">Select</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="thisWeek">This Week</option>
            <option value="previousWeek">Previous Week</option>
            <option value="thisMonth">This Month</option>
            <option value="nextMonth">Next Month</option>
          </select>
          <br />
          <button onClick={handleStartMovement}>Start Movement</button>
        </div>
      </Popup>
    </Marker>
  );
}

function ClickHandler() {
  useMapEvent("click", (event) => {
    const { lat, lng } = event.latlng;
    console.log(`Latitude: ${lat}, Longitude: ${lng}`);
  });

  return null;
}

export default Maps;
