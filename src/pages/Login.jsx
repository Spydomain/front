import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login({ setUser }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { email, password } = formData;
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/user/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (data.role !== 'user') {
        setError('Admins cannot log in here. Please use the admin portal.');
        return;
      }

      localStorage.setItem('token', data.token);
      const userData = { email, role: data.role };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      setFormData({ email: '', password: '' });
      navigate('/user-dashboard');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Login failed. Try again.';
      setError(msg);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded shadow mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">User Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-2">{error}</div>
        )}
        <label className="block">
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </label>
        <label className="block">
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </label>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Log In
        </button>
      </form>
    </div>
  );
}