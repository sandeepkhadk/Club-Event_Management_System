import React from 'react'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
      
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
        <span className="text-xl font-semibold">
          Event & Club Management System
        </span>
      </div>

      {/* Menu */}
      <ul className="flex items-center gap-8 text-sm font-medium">
        <Link to="/" className="hover:text-cyan-400 cursor-pointer transition">Home</Link>
        <Link to="/about" className="hover:text-cyan-400 cursor-pointer transition">About</Link>
        <Link to="/events" className="hover:text-cyan-400 cursor-pointer transition">Events</Link>
        <Link to="/clubs" className="hover:text-cyan-400 cursor-pointer transition">Clubs</Link>
        <Link to="/contact" className="hover:text-cyan-400 cursor-pointer transition">Contact</Link>
      </ul>

      {/* Action Button */}
      <div className="flex items-center gap-[3px]">
        <button className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-md text-sm font-semibold transition">
            <Link to="/register">Register</Link>
        </button>

        <button className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-md text-sm font-semibold transition">
            <Link to="/login">Login</Link>
        </button>
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden">
        <button className="text-2xl">☰</button>
      </div>
    </nav>
  )
}
export default Navbar