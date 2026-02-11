import React, { useState, useEffect } from "react";
import Navbar from "../home/navbar";
import { Search, Users, Calendar } from "lucide-react";
import { useAuthContext } from "../../context/provider/AuthContext";
const Club = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuthContext(); // get token from context
  const categories = ["All", "Departments", "Technology", "Music & Arts"];

  // Fetch clubs from backend
 // Fetch clubs from backend
useEffect(() => {
  const fetchClubs = async () => {
   

    try {
      const res = await fetch("http://127.0.0.1:8000/clubs/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized. Please login.");
        throw new Error("Failed to fetch clubs");
      }

      const data = await res.json();
      console.log("Raw club data:", data.clubs);
      // Format data if needed
      const formatted = data.clubs.map((c) => ({
        id: c.club_id,
        name: c.name,
        desc: c.description || "",
        created_at: c.created_at,
        created_by: c.created_by,
      }));

      setClubs(formatted);
      console.log("Fetched clubs:", formatted);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchClubs();
}, []);


  const filteredClubs =
    activeFilter === "All"
      ? clubs
      : clubs.filter((club) => club.category === activeFilter);

  if (loading)
    return (
      <>
        <Navbar />
        <div className="text-center mt-20 text-indigo-600 font-semibold">
          Loading clubs...
        </div>
      </>
    );

  if (error)
    return (
      <>
        <Navbar />
        <div className="text-center mt-20 text-red-600 font-semibold">
          {error}
        </div>
      </>
    );

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
              className="mx-auto w-full max-w-xs bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition transform hover:-translate-y-0.5"
            >
              {/* Taller banner */}
              <div className={`h-32 ${club.banner}`} />

              <div className="p-4 pt-0 -mt-6">
                {/* Avatar */}
                {/* <div
                  className={`w-12 h-12 ${club.color} border-4 border-white rounded-xl flex items-center justify-center text-xl mb-3`}
                >
                  {club.icon}
                </div> */}

                <h3 className="text-base font-semibold leading-snug mb-1">
                  {club.name}
                </h3>

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
