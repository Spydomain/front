import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">

        <div>
          <h2 className="text-xl font-semibold mb-2">Bike Rental Nepal</h2>
          <p className="text-sm">
            A smart platform to rent motorbikes across Nepal. Easy, fast, and convenient for both locals and tourists.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
          <ul className="space-y-1 text-sm">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/bikes" className="hover:underline">Bikes</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            <li><Link to="/login" className="hover:underline">Login</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
          <p className="text-sm">Email: support@bikerentalnepal.com</p>
          <p className="text-sm">Phone: +977-9800000000</p>
          <p className="text-sm">Location: Kathmandu, Nepal</p>
        </div>
      </div>

      <div className="text-center text-sm py-4 bg-blue-700">
        © {new Date().getFullYear()} Bike Rental Nepal. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
