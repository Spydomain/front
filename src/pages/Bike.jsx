import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBikesApi } from '../api/api';  // make sure your api.js exports this function

export default function Bike() {
  const navigate = useNavigate();
  const [bikes, setBikes] = useState([]);

  useEffect(() => {
    async function fetchBikes() {
      try {
        const response = await getBikesApi();
        setBikes(response.data);
      } catch (error) {
        console.error('Failed to fetch bikes:', error);
      }
    }
    fetchBikes();
  }, []);

  const handleSelectBike = (bike) => {
    localStorage.setItem('selectedBike', JSON.stringify(bike));
    navigate('/payment');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Select a Bike to Rent</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {bikes.map((bike) => (
          <div
            key={bike.id}
            className="border rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow duration-300 flex flex-col"
          >
            <img src={`http://localhost:5000/uploads/bikes/${bike.image}`} // adjust URL if deployed
            alt={bike.name}
            className="h-f"
          />

            <h3 className="text-xl font-semibold mb-2">{bike.name}</h3>
            <p className="text-gray-700 mb-4">Price: NPR {bike.price} / hour</p>
            <button
              onClick={() => handleSelectBike(bike)}
              className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            >
              Rent Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
