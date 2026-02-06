import React, { useState } from 'react';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
   <nav className="bg-gradient-to-r from-gray-900 to-blue-950 text-white px-6 py-4 sticky top-0 z-[100] shadow-lg">

      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 shrink-0">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
          <span className="text-lg font-bold tracking-tight hidden sm:inline-block">
            ECMS
          </span>
        </div>

    {/* Desktop Menu (Hidden on Mobile) */}
    <ul className="hidden lg:flex items-center gap-8 text-sm font-medium">
      <Link to="/" className="hover:text-cyan-500 transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-blue-300 after:transition-all hover:after:w-full">Home</Link>
      <Link to="/about" className="hover:text-cyan-500 transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-blue-300 after:transition-all hover:after:w-full">About</Link>
      <Link to="/events" className="hover:text-cyan-500 transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-blue-300 after:transition-all hover:after:w-full">Events</Link>
      <Link to="/clubs" className="hover:text-cyan-500 transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-blue-300 after:transition-all hover:after:w-full">Clubs</Link>
      <Link to="/contact" className="hover:text-cyan-500 transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-blue-300 after:transition-all hover:after:w-full">Contact</Link>
    </ul>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold hover:text-cyan-300 transition">Login</Link>
          <Link to="/register" className="bg-cyan-500 hover:bg-cyan-600 px-5 py-2 rounded-full text-sm font-bold text-slate-900 transition">
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger Icon (Visible only on Mobile) */}
        <div className="lg:hidden">
          <button onClick={() => setIsOpen(true)} className="text-cyan-400 p-2">
            <Menu size={30} />
          </button>
        </div>
      </div>

      {/* --- MOBILE SIDEBAR SECTION --- */}
      
      {/* 1. Dark Overlay (Backdrop) */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
      />

      {/* 2. Right-Hand Side Drawer */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-slate-900 shadow-2xl z-\[110\] transform transition-transform duration-300 ease-in-out lg:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Close Button inside Sidebar */}
        <div className="flex justify-end p-6">
          <button onClick={closeMenu} className="text-cyan-400">
            <X size={32} />
          </button>
        </div>

        {/* Vertical List of Links */}
        <ul className="flex flex-col gap-6 px-10 text-lg font-semibold">
          <Link to="/" onClick={closeMenu} className="hover:text-cyan-400 transition">Home</Link>
          <Link to="/about" onClick={closeMenu} className="hover:text-cyan-400 transition">About</Link>
          <Link to="/events" onClick={closeMenu} className="hover:text-cyan-400 transition">Events</Link>
          <Link to="/clubs" onClick={closeMenu} className="hover:text-cyan-400 transition">Clubs</Link>
          <Link to="/contact" onClick={closeMenu} className="hover:text-cyan-400 transition">Contact</Link>
          
          <hr className="border-slate-800 my-2" />
          
          {/* Mobile Buttons */}
          <Link to="/login" onClick={closeMenu} className="text-cyan-400 py-2">
            Login
          </Link>
          <Link to="/register" onClick={closeMenu} className="bg-cyan-500 text-slate-900 text-center py-3 rounded-xl font-bold">
            Register
          </Link>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;