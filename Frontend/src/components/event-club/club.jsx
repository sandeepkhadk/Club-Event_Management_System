import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../home/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Users, Calendar, X, LayoutGrid, ArrowRight, UserCheck, Info, LogIn } from "lucide-react";
import { useAuthContext } from "../../context/provider/AuthContext";
import apiUrl from "../../api";

const Club = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuthContext();

  const showNavbar = location.pathname.startsWith("/clubs");

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClubs = useMemo(() => {
    if (!searchTerm.trim()) return clubs;
    const s = searchTerm.toLowerCase();
    return clubs.filter(c =>
      c.name.toLowerCase().includes(s) || c.desc.toLowerCase().includes(s)
    );
  }, [clubs, searchTerm]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch(`${apiUrl}clubs/`);
        if (!res.ok) throw new Error("Failed to fetch clubs");
        const data = await res.json();

        const mapped = data.clubs.map(c => ({
          id: c.club_id,
          name: c.name,
          desc: c.description || "",
          members: c.members_names?.length || 0,
          events: c.events_count || 0,
          category: c.category || "General",
        }));

        setClubs(mapped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading clubs...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}

      <div className="max-w-5xl mx-auto p-6">
        <input
          placeholder="Search clubs..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full p-3 border rounded-xl mb-6"
        />

        <div className="grid md:grid-cols-2 gap-6">
          {filteredClubs.map(club => (
            <div
              key={club.id}
              className="bg-white p-6 rounded-2xl shadow cursor-pointer hover:shadow-lg"
              onClick={() => setSelectedClub(club)}
            >
              <h3 className="text-xl font-bold mb-2">{club.name}</h3>
              <p className="text-gray-600 mb-4">{club.desc}</p>
              <div className="flex justify-between text-sm">
                <span>👥 {club.members}</span>
                <span>📅 {club.events}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedClub && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl max-w-lg w-full relative">
            <button
              onClick={() => setSelectedClub(null)}
              className="absolute top-3 right-3"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold mb-4">{selectedClub.name}</h2>
            <p className="mb-6">{selectedClub.desc}</p>

            {!token ? (
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl"
              >
                Login to Join
              </button>
            ) : (
              <button
                onClick={() => alert("Join request sent!")}
                className="bg-green-600 text-white px-4 py-2 rounded-xl"
              >
                Join Club
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Club;