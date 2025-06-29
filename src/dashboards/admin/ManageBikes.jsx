import React, { useEffect, useState } from 'react';
import { getBikesApi, deleteBikeApi } from '../../api/api';

export default function ManageBike({ refresh }) {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBikes = async () => {
    try {
      setLoading(true);
      const res = await getBikesApi();
      setBikes(res.data);
    } catch (err) {
      console.error('Failed to fetch bikes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, [refresh]); // refetch on refresh prop change

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bike?')) return;
    try {
      await deleteBikeApi(id);
      fetchBikes();
    } catch (err) {
      console.error('Failed to delete bike', err);
    }
  };

  if (loading) return <p>Loading bikes...</p>;

  if (bikes.length === 0) return <p>No bikes available</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Bikes</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bikes.map(bike => (
            <tr key={bike.id}>
              <td className="border px-4 py-2">{bike.name}</td>
              <td className="border px-4 py-2">{bike.price}</td>
              <td className="border px-4 py-2">
              <img src={`http://localhost:5000/uploads/bikes/${bike.image}`} // adjust URL if deployedalt={bike.name}
              className="h-16"
              />

              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(bike.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
