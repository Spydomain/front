import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'

const UserLayout = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">User Dashboard</h1>
        <div className="space-x-4">
          <Link to="/user" className="text-gray-700 hover:text-blue-500">Home</Link>
          <Link to="/user/my-bookings" className="text-gray-700 hover:text-blue-500">My Bookings</Link>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default UserLayout
