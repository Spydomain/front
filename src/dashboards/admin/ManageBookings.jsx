import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManageBookings() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders');
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await axios.put(`/api/orders/${id}/status`, { action });
      setOrders(prev =>
        prev.map(o =>
          o.id === id ? { ...o, status: action === 'accept' ? 'accepted' : 'declined' } : o
        )
      );
    } catch (err) {
      console.error(`Failed to ${action} order:`, err);
      alert(`Could not ${action} the order.`);
    }
  };

  if (loading) return <p className="text-center mt-4">Loading orders...</p>;
  if (orders.length === 0) return <p className="text-center mt-4">No orders found.</p>;

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border border-gray-300 text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">User Email</th>
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
          {orders.map(order => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{order.User?.email || 'N/A'}</td>
              <td className="px-4 py-2 border">{order.Bike?.name || 'N/A'}</td>
              <td className="px-4 py-2 border">{order.hours}</td>
              <td className="px-4 py-2 border">{order.totalAmount}</td>
              <td className="px-4 py-2 border capitalize">{order.status}</td>
              <td className="px-4 py-2 border capitalize">{order.paymentMethod || 'N/A'}</td>
              <td className="px-4 py-2 border">{order.paymentRef || 'N/A'}</td>
              <td className="px-4 py-2 border space-x-2">
                {order.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleAction(order.id, 'accept')}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(order.id, 'decline')}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Decline
                    </button>
                  </>
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
