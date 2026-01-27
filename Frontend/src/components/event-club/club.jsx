import React, { useState } from 'react';
import { Search, Users, Calendar} from 'lucide-react';

const Club = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Departments', 'Technology', 'Music & Arts'];

  const clubs = [
    {
      id: 1,
      name: "Robotics Club",
      category: "Technology",
      desc: "Building the future, one circuit at a time. Join us for weekly workshops.",
      members: 124,
      events: 2,
      icon: "🚀",
      color: "bg-yellow-400",
      banner: "bg-gradient-to-r from-blue-400 to-indigo-500"
    },
    {
      id: 2,
      name: "Fine Arts Club",
      category: "Music & Arts",
      desc: "A haven for painters, sketchers, and digital artists across campus.",
      members: 85,
      events: 1,
      icon: "🎨",
      color: "bg-red-400",
      banner: "bg-gradient-to-r from-purple-400 to-pink-500"
    },
    {
      id: 3,
      name: "Football Varsity",
      category: "Sports",
      desc: "Official college team. Training every Monday and Wednesday at the arena.",
      members: 42,
      events: 5,
      icon: "⚽",
      color: "bg-blue-500",
      banner: "bg-gradient-to-r from-green-400 to-teal-500"
    }
  ];

  const filteredClubs = activeFilter === 'All' 
    ? clubs 
    : clubs.filter(club => club.category === activeFilter);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Guest Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-600 tracking-tight">CampusConnect</div>
        <div className="hidden md:flex space-x-8 font-medium text-gray-600">
          <a href="#" className="text-indigo-600 border-b-2 border-indigo-600">Clubs</a>
          <a href="#" className="hover:text-indigo-600 transition">Events</a>
          <a href="#" className="hover:text-indigo-600 transition">About</a>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-indigo-700 shadow-md transition">
            Join Now
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-gray-900">
          Find Your <span className="text-indigo-600">Tribe.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Explore student-led organizations and activities happening across your campus.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative group">
          <Search className="absolute left-4 top-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={24} />
          <input 
            type="text" 
            placeholder="Search for clubs, hobbies, or interests..." 
            className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-200 shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>
      </header>

      {/* Categories / Filters */}
      <div className="max-w-7xl mx-auto px-6 flex space-x-3 overflow-x-auto pb-10 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
              activeFilter === cat 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
              : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Club Grid */}
      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pb-24">
        {filteredClubs.map((club) => (
          <div key={club.id} className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            {/* Banner */}
            <div className={`h-36 ${club.banner}`} />
            
            <div className="p-8 pt-0 -mt-10">
              {/* Xender-style Avatar */}
              <div className={`w-20 h-20 ${club.color} border-8 border-white rounded-3xl flex items-center justify-center text-3xl mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                {club.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-2">{club.name}</h3>
              <p className="text-gray-500 leading-relaxed mb-6">
                {club.desc}
              </p>
              
              <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                <div className="flex space-x-4 text-gray-400 text-sm">
                  <span className="flex items-center"><Users size={16} className="mr-1"/> {club.members}</span>
                  <span className="flex items-center"><Calendar size={16} className="mr-1"/> {club.events} Events</span>
                </div>
                <button className="text-indigo-600 font-bold hover:text-indigo-800 transition">
                  View Profile →
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Call to Action Footer */}
      <footer className="bg-indigo-900 py-7 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Connect with your campus community</h2>
        <p className="text-indigo-200 mb-3 px-4">Participate in clubs and events that match your interests.</p>
        
      </footer>
    </div>
  );
};

export default Club;