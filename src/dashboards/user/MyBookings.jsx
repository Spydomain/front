import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function MyBookings({ user: propUser }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = propUser || JSON.parse(localStorage.getItem('user'));
  const userEmail = user?.email;

  useEffect(() => {
    if (!userEmail) return;

    axios.get(`/api/orders/user/email/${encodeURIComponent(userEmail)}`)
      .then(res => setOrders(res.data.orders || []))
      .catch(err => console.error('Error fetching orders:', err))
      .finally(() => setLoading(false));
  }, [userEmail]);

  const handleCancel = async (id) => {
    try {
      await axios.put(`/api/orders/${id}/status`, { action: 'cancel' });
      setOrders(prev =>
        prev.map(o => o.id === id ? { ...o, status: 'cancelled' } : o)
      );
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Failed to cancel order.');
    }
  };

  if (loading) return <p className="text-center mt-4">Loading your bookings...</p>;
  if (!userEmail) return <p className="text-red-600 text-center">User not logged in.</p>;
  if (orders.length === 0) return <p className="text-center mt-4">You have no bookings yet.</p>;

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border border-gray-300 text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Bike</th>
            <th className="px-4 py-2 border">Hours</th>
            <th className="px-4 py-2 border">Total (NPR)</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Payment Method</th>
            <th className="px-4 py-2 border">Payment Ref</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{o.Bike?.name || 'N/A'}</td>
              <td className="px-4 py-2 border">{o.hours}</td>
              <td className="px-4 py-2 border">{o.totalAmount}</td>
              <td className="px-4 py-2 border capitalize">{o.status}</td>
              <td className="px-4 py-2 border capitalize">{o.paymentMethod || 'N/A'}</td>
              <td className="px-4 py-2 border">{o.paymentRef || 'N/A'}</td>
              <td className="px-4 py-2 border">
                {o.status === 'pending' ? (
                  <button
                    onClick={() => handleCancel(o.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                ) : (
                  <span className="text-gray-500 italic">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
