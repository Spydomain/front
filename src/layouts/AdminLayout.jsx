import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/admin-login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 text-2xl font-bold text-blue-600 border-b">
          Admin Panel
        </div>
        <nav className="flex flex-col p-4 gap-3 text-gray-700">
          <Link to="/admin/add-bike" className="hover:text-blue-500">
            Add Bike
          </Link>
          <Link to="/admin/manage-bikes" className="hover:text-blue-500">
            Manage Bikes
          </Link>
          <Link to="/admin/manage-bookings" className="hover:text-blue-500">
            Manage Bookings
          </Link>
          <Link to="/admin/manage-messages" className="hover:text-blue-500">
            Manage Messages
          </Link>

          <button
            onClick={handleLogout}
            className="mt-6 text-red-500 hover:underline text-left"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-white rounded shadow">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
