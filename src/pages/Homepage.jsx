import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import { getBikesApi } from '../api/api'; // adjust path if needed

export default function Homepage() {
  const navigate = useNavigate();
  const [bikes, setBikes] = useState([]);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const res = await getBikesApi();
        setBikes(res.data);
      } catch (err) {
        console.error('Failed to fetch bikes:', err);
      }
    };
    fetchBikes();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to Bike Rental Nepal</h1>

      {/* Slider */}
      <div className="mb-10">
        <Slider {...sliderSettings}>
          {bikes.map((bike) => (
            <div
              key={bike.id}
              onClick={() => navigate('/bikes')}
              className="cursor-pointer px-2"
            >
              {/* Aspect ratio box */}
              <div className="relative w-full rounded-xl shadow overflow-hidden" style={{ paddingTop: '56.25%' }}>
                <img
                  src={`http://localhost:5000/uploads/bikes/${bike.image}`}
                  alt={bike.name}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-4 py-2 rounded">
                  <h2 className="text-xl font-semibold">{bike.name}</h2>
                  <p className="text-sm">From NPR {bike.price}/hour</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
