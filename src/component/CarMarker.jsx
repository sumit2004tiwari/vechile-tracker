import React, { useEffect } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

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
      //tjos 
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
      <Popup className="w-[370px]">
        <div className="p-10 w-[250px] bg-white rounded-lg shadow-2xl text-sm font-medium text-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-blue-500 font-semibold">WIRELESS</div>
            <div className="text-green-500 flex items-center">
              <span>🕒</span> 
              <span className="ml-1">Jul 20, 07:09 AM</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <strong>0.00 km/h</strong>
              <p>Speed</p>
            </div>
            <div>
              <strong>0.00 km</strong>
              <p>Distance</p>
            </div>
            <div>
              <strong>16%</strong>
              <p>Battery</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center mt-4">
            <div>
              <strong>834.89 km</strong>
              <p>Total Distance</p>
            </div>
            <div>
              <strong>0.00 km</strong>
              <p>Distance From Last Stop</p>
            </div>
            <div>
              <strong>7h:10m</strong>
              <p>Today Stopped</p>
            </div>
          </div>

          <div className="text-center mt-4">
            <strong>Status:</strong> Stopped
          </div>

          <label htmlFor="dateRange" className="block mt-4 text-gray-600">
            Select Date Range:
          </label>
          <select
            id="dateRange"
            value={dateRange}
            onChange={handleDateRangeChange}
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="thisWeek">This Week</option>
            <option value="previousWeek">Previous Week</option>
            <option value="thisMonth">This Month</option>
            <option value="nextMonth">Next Month</option>
          </select>

          <button
            onClick={handleStartMovement}
            className="mt-4 w-full border-4 text-green-700 text-md hover:text-white hover:bg-green-500 hover:border-green-900 border-green-500 font-semibold py-2 rounded-lg transition duration-300"
          >
            Start Movement
          </button>
        </div>
      </Popup>
    </Marker>
  );
}

export default CarMarker;
