import React from 'react';
import MyBookings from './MyBookings';

const UserDashboard = ({ user }) => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
    <MyBookings user={user} />
  </div>
);

export default UserDashboard;
