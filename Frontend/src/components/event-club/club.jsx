import React, { useState } from "react";
import Navbar from "../home/navbar";
import {
  Search,
  Users,
  Calendar,
  Menu,
  X,
  Home,
  CalendarDays,
  Users2,
} from "lucide-react";

const Club = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [open, setOpen] = useState(false);

  const categories = ["All", "Departments", "Technology", "Music & Arts"];

  const clubs = [
    {
      id: 1,
      name: "Robotics Club",
      category: "Technology",
      desc: "Hands-on workshops and robotics competitions.",
      members: 124,
      events: 2,
      icon: "🚀",
      color: "bg-yellow-400",
      banner: "bg-gradient-to-r from-blue-400 to-indigo-500",
    },
    {
      id: 2,
      name: "Fine Arts Club",
      category: "Music & Arts",
      desc: "Creative space for painting and digital art.",
      members: 85,
      events: 1,
      icon: "🎨",
      color: "bg-red-400",
      banner: "bg-gradient-to-r from-purple-400 to-pink-500",
    },
    {
      id: 3,
      name: "Football Varsity",
      category: "Departments",
      desc: "Official college football team.",
      members: 42,
      events: 5,
      icon: "⚽",
      color: "bg-blue-500",
      banner: "bg-gradient-to-r from-green-400 to-teal-500",
    },
  ];

  const filteredClubs =
    activeFilter === "All"
      ? clubs
      : clubs.filter((club) => club.category === activeFilter);

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-indigo-50 text-slate-800">
      {/* ================= HERO ================= */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 py-14 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Find Your <span className="text-indigo-600">Tribe</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
          Discover clubs and communities across your campus.
        </p>

        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search clubs..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </header>

      {/* ================= FILTERS ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-3 overflow-x-auto pb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-1.5 rounded-full whitespace-nowrap text-sm font-medium transition ${
              activeFilter === cat
                ? "bg-indigo-600 text-white shadow"
                : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      {/* ================= CLUB GRID ================= */}
     <main className="max-w-6xl mx-auto px-2 sm:px-4 grid grid-cols-1 sm:grid-cols-3 gap-2 pb-20">
      {filteredClubs.map((club) => (
        <div
          key={club.id}
          className="mx-auto w-full max-w-xs bg-white rounded-xl border border-gray-100
                    overflow-hidden hover:shadow-md transition transform hover:-translate-y-0.5"
        >
          {/* Taller banner */}
          <div className={`h-32 ${club.banner}`} />

          <div className="p-4 pt-0 -mt-6">
            {/* Avatar */}
            <div
              className={`w-12 h-12 ${club.color} border-4 border-white rounded-xl
                          flex items-center justify-center text-xl mb-3`}
            >
              {club.icon}
            </div>

            <h3 className="text-base font-semibold leading-snug mb-1">
              {club.name}
            </h3>

            {/* Description (allow more lines for taller card) */}
            <p className="text-xs text-gray-500 mb-3 line-clamp-4">
              {club.desc}
            </p>

            <div className="flex items-center justify-between border-t pt-2.5">
              <div className="flex gap-2 text-gray-400 text-[11px]">
                <span className="flex items-center gap-1">
                  <Users size={12} /> {club.members}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {club.events}
                </span>
              </div>

              <button className="text-indigo-600 text-xs font-semibold hover:text-indigo-800">
                View →
              </button>
            </div>
          </div>
        </div>
      ))}
    </main>


      {/* ================= FOOTER ================= */}
      <footer className="bg-indigo-900 py-10 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">
          Connect with your campus community
        </h2>
        <p className="text-indigo-200 px-4 text-sm">
          Join clubs, attend events, and grow together.
        </p>
      </footer>
    </div>
  </>
  );
};

export default Club;
