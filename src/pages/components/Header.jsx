import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/Logo.png';

export default function Header({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  // Get role from user
  const role = user?.role;

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/">
        <img
          src={logo}
          alt="Bike Rental Nepal Logo"
          className="h-10 w-auto cursor-pointer"
        />
      </Link>

      <nav className="flex items-center space-x-4">
        {user ? (
          <>
            {role === 'user' && (
              <button
                onClick={() => navigate('/user-dashboard')}
                className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-700"
              >
                User Dashboard
              </button>
            )}

            {role === 'admin' && (
              <button
                onClick={() => navigate('/admin/manage-bikes')}
                className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-700"
              >
                Admin Dashboard
              </button>
            )}

            <div className="px-3 py-1 bg-blue-500 rounded">{user.email}</div>

            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded bg-red-500 hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/register"
              className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-700"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-700"
            >
              Login
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
