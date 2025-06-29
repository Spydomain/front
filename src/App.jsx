import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Components
import Header from './pages/components/Header';
import Footer from './pages/components/Footer';

// Pages
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import Bike from './pages/Bike';
import Payment from './pages/Payment';
import AdminLogin from './pages/AdminLogin';

// Dashboards & Admin Panel
import AdminLayout from './layouts/AdminLayout';
import ManageBike from './dashboards/admin/ManageBikes';
import AddBike from './pages/components/AddBike';
import MyBookings from './dashboards/user/MyBookings';
import UserDashboard from './dashboards/user/UserDashboard';
import ManageBookings from './dashboards/admin/ManageBookings';
import ManageMessages from './dashboards/admin/ManageMessages';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Failed to parse user from localStorage:', err);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header user={user} setUser={setUser} />

        <main className="flex-grow container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Homepage />} />

            {/* Login and Register */}
            <Route
              path="/login"
              element={
                isLoggedIn && !isAdmin ? (
                  <Navigate to="/user-dashboard" replace />
                ) : (
                  <Login setUser={setUser} />
                )
              }
            />
            <Route
              path="/register"
              element={
                isLoggedIn ? <Navigate to="/" replace /> : <Register />
              }
            />

            {/* Admin Login */}
            <Route
              path="/admin-login"
              element={
                isLoggedIn && isAdmin ? (
                  <Navigate to="/admin/manage-bikes" replace />
                ) : (
                  <AdminLogin setUser={setUser} />
                )
              }
            />

            <Route path="/contact" element={<Contact />} />
            <Route path="/bikes" element={<Bike />} />
            <Route path="/payment" element={<Payment />} />

            {/* User Dashboard Route */}
            <Route
              path="/user-dashboard"
              element={
                isLoggedIn && !isAdmin ? (
                  <UserDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Admin Panel Routes */}
            <Route
              path="/admin/*"
              element={
                isLoggedIn && isAdmin ? (
                  <AdminLayout />
                ) : (
                  <Navigate to="/admin-login" replace />
                )
              }
            >
              <Route index element={<Navigate to="manage-bikes" replace />} />
              <Route path="manage-bikes" element={<ManageBike />} />
              <Route path="add-bike" element={<AddBike />} />
              <Route path="manage-bookings" element={<ManageBookings />} />

              <Route path="user-dashboard" element={<MyBookings />} />
              <Route path="manage-messages" element={<ManageMessages />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<h2>404 - Page Not Found</h2>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
