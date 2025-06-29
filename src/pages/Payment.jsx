import React, { useEffect, useState } from 'react';

export default function Payment() {
  const [selectedBike, setSelectedBike] = useState(null);
  const [hours, setHours] = useState(1);

  useEffect(() => {
    // Load Khalti script
    if (!document.getElementById('khalti-script')) {
      const script = document.createElement('script');
      script.id = 'khalti-script';
      script.src = 'https://khalti.com/static/khalti-checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }

    // Load selected bike from localStorage
    const bikeData = localStorage.getItem('selectedBike');
    if (bikeData) {
      setSelectedBike(JSON.parse(bikeData));
    }
  }, []);

  const handlePayment = () => {
    if (!window.KhaltiCheckout) {
      alert('Khalti is still loading. Please wait a moment.');
      return;
    }

    if (!selectedBike || hours < 1) {
      alert('Please select a valid bike and number of hours.');
      return;
    }

    const totalAmount = selectedBike.price * hours * 100; // convert to paisa

    const config = {
      publicKey: 'test_public_key_dc74f6db5b87415a9c1037d0c71343e3',
      productIdentity: `bike-${selectedBike.id}`,
      productName: selectedBike.name,
      productUrl: 'http://localhost:5173/payment',
      eventHandler: {
        onSuccess(payload) {
          alert(`✅ Payment Successful!\nBike: ${selectedBike.name}\nHours: ${hours}\nAmount: NPR ${payload.amount / 100}\nReference: ${payload.idx}`);
          // TODO: Save order to DB if needed
          localStorage.removeItem('selectedBike');
        },
        onError(error) {
          alert('❌ Payment failed or cancelled.');
          console.error(error);
        },
        onClose() {
          console.log('Payment widget closed');
        },
      },
      paymentPreference: ['KHALTI'],
    };

    const checkout = new window.KhaltiCheckout(config);
    checkout.show({ amount: totalAmount });
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

      <p className="mb-4 font-semibold">
        Total Amount: <span className="text-blue-700">NPR {selectedBike.price * hours}</span>
      </p>

      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Pay with Khalti
      </button>
    </div>
  );
}
