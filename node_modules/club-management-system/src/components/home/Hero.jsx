import React from 'react'
import campus from '../../assets/campus.jpg'

const Hero = () => {
  return (
    <>
      {/* Hero Section */}
      <section
        className="h-screen flex items-center justify-center text-white"
        style={{
          backgroundImage: `
           linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.45)),
            url(${campus})
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">
            Event & Club Management System
          </h1>
          <p className="text-lg">
            Organize clubs and events efficiently
          </p>
        </div>
      </section>

      {/* Copyright Section */}
      <footer className="bg-slate-900 text-gray-300 text-center py-4">
        <p className="text-sm">
          © {new Date().getFullYear()} Event & Club Management System. All rights reserved.
        </p>
      </footer>
    </>
  )
}

export default Hero;
