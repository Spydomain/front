import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManageBookings() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/user/${user.id}`);
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchBookings();
  }, []);

  if (loading) return <p>Loading bookings...</p>;

  if (orders.length === 0) return <p>No bookings found</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Bike</th>
            <th className="border px-4 py-2">Hours</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Payment Ref</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td className="border px-4 py-2">{order.Bike?.name || 'Bike Deleted'}</td>
              <td className="border px-4 py-2">{order.hours}</td>
              <td className="border px-4 py-2">NPR {order.totalAmount}</td>
              <td className={`border px-4 py-2 font-bold ${order.status === 'paid' ? 'text-green-600' : 'text-yellow-500'}`}>
                {order.status.toUpperCase()}
              </td>
              <td className="border px-4 py-2">{order.paymentReference || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
