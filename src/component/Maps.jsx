import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import CarMarker from "./CarMarker"; 
import "leaflet/dist/leaflet.css";
import car1 from "../assets/Car1.png"
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
      
      <p>hello</p>
      <p>hello</p>

    </MapContainer>
    
  );
}

export default Maps;
