import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Payment() {
  const [selectedBike, setSelectedBike] = useState(null);
  const [hours, setHours] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('khalti');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!document.getElementById('khalti-script')) {
      const script = document.createElement('script');
      script.id = 'khalti-script';
      script.src = 'https://khalti.com/static/khalti-checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }

    const bikeData = localStorage.getItem('selectedBike');
    if (bikeData) {
      setSelectedBike(JSON.parse(bikeData));
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      console.log("🧠 User from localStorage:", storedUser);
      if (storedUser && storedUser.email) {
        setUser(storedUser);
      } else {
        console.warn('❌ User not logged in or missing email');
      }
    } catch (error) {
      console.error('❌ Error reading user from localStorage:', error);
    }
  }, []);

  const handlePlaceOrder = async (orderData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/orders/place', orderData);
      return response.data.order;
    } catch (error) {
      console.error('❌ Order placement failed:', error);
      alert('Order failed. Please try again.');
      return null;
    }
  };

  const handlePayment = async () => {
    if (!selectedBike || hours < 1) {
      alert('Please select a valid bike and number of hours.');
      return;
    }

    if (!user?.email) {
      alert('❌ You must be logged in to place an order.');
      return;
    }

    const totalAmount = selectedBike.price * hours;

    const commonOrderData = {
      userEmail: user.email, 
      bikeId: selectedBike.id,
      hours,
      totalAmount,
    };

    if (paymentMethod === 'cod') {
      const order = await handlePlaceOrder({
        ...commonOrderData,
        paymentMethod: 'cod',
        status: 'pending',
        paymentRef: null,
      });
      if (order) {
        alert('✅ Order placed successfully with Cash on Delivery!');
        localStorage.removeItem('selectedBike');
        navigate('/user-dashboard');
      }
      return;
    }

    if (!window.KhaltiCheckout) {
      alert('Khalti is still loading. Please wait a moment.');
      return;
    }

    const checkout = new window.KhaltiCheckout({
      publicKey: 'test_public_key_dc74f6db5b87415a9c1037d0c71343e3',
      productIdentity: `bike-${selectedBike.id}`,
      productName: selectedBike.name,
      productUrl: 'http://localhost:5173/payment',
      eventHandler: {
        onSuccess: async (payload) => {
          const order = await handlePlaceOrder({
            ...commonOrderData,
            paymentMethod: 'khalti',
            status: 'paid',
            paymentRef: payload.idx,
          });
          if (order) {
            alert(`✅ Payment Successful! Reference: ${payload.idx}`);
            localStorage.removeItem('selectedBike');
            navigate('/user-dashboard');
          } else {
            alert('❌ Order saving failed after payment.');
          }
        },
        onError: (err) => {
          alert('❌ Khalti payment failed.');
          console.error(err);
        },
        onClose: () => console.log('Khalti widget closed'),
      },
      paymentPreference: ['KHALTI'],
    });

    checkout.show({ amount: totalAmount * 100 }); 
  };

  if (!selectedBike) {
    return (
      <div className="text-center mt-10 text-red-600">
        <p>No bike selected. Please go back and choose a bike first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 border rounded shadow mt-10 text-center">
      <h2 className="text-3xl font-bold mb-4">Confirm Your Rental</h2>
      <img
        src={`http://localhost:5000/uploads/bikes/${selectedBike.image}`}
        alt={selectedBike.name}
        className="w-full h-40 object-cover rounded mb-4"
      />
      <h3 className="text-xl font-semibold">{selectedBike.name}</h3>
      <p className="mb-2">Rate: NPR {selectedBike.price} / hour</p>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Select number of hours:</label>
        <input
          type="number"
          min="1"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-4 text-left">
        <label className="block font-medium mb-2">Payment Method:</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="khalti"
              checked={paymentMethod === 'khalti'}
              onChange={() => setPaymentMethod('khalti')}
            />
            Pay with Khalti
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={() => setPaymentMethod('cod')}
            />
            Cash on Delivery (COD)
          </label>
        </div>
      </div>

      <p className="mb-4 font-semibold">
        Total Amount: <span className="text-blue-700">NPR {selectedBike.price * hours}</span>
      </p>

      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        {paymentMethod === 'khalti' ? 'Pay with Khalti' : 'Place COD Order'}
      </button>
    </div>
  );
}
