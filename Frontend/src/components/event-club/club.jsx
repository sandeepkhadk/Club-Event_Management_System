import React, { useState, useEffect } from "react";
import Navbar from "../home/navbar";
import { Search, Users, Calendar, X, Filter, LayoutGrid, ArrowRight, UserCheck } from "lucide-react";
import { useAuthContext } from "../../context/provider/AuthContext";
import { useNavigate } from "react-router-dom";

const Club = () => {
  const navigate = useNavigate();
  const { token } = useAuthContext();
  const [activeFilter, setActiveFilter] = useState("All");
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [joining, setJoining] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", reason: "" });

  const categories = ["All", "Departments", "Technology", "Music & Arts"];

  useEffect(() => {
    if (!token) return;
    const fetchUser = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/users/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setFormData((prev) => ({
            ...prev,
            name: data.name || data.username || "",
            email: data.email || "",
          }));
        }
      } catch (err) {
        console.error("Profile fetch failed", err);
      }
    };
    fetchUser();
  }, [token]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/clubs/");
        if (!res.ok) throw new Error("Failed to fetch clubs");
        const data = await res.json();
        setClubs(data.clubs.map(c => ({
          id: c.club_id,
          name: c.name,
          desc: c.description || "",
          members: c.members_count || 0,
          events: c.events_count || 0,
          category: c.category || "Community"
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  const handleJoinClub = async (e) => {
    e.preventDefault();
    setJoining(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/clubs/${selectedClub.id}/join/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to join. You might already be a member.");
      alert("Application sent! Wait for admin approval.");
      setSelectedClub(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setJoining(false);
    }
  };

  const filteredClubs = activeFilter === "All" ? clubs : clubs.filter((c) => c.category === activeFilter);

  if (loading) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-32 space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading Club Directory...</p>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      {/* Changed background to slate-50 for a clean, diligent look */}
      <div className="min-h-screen bg-slate-50 text-slate-800">
        
        {/* --- Header Section (White background to contrast with page bg) --- */}
        <header className="bg-white border-b border-slate-200 pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Campus Organizations</h1>
            <p className="text-slate-500 mb-8 font-medium">Find and join official student communities.</p>
            
            <div className="max-w-xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search clubs..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all" 
              />
            </div>
          </div>
        </header>

        {/* --- Filter Bar --- */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex gap-4 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setActiveFilter(cat)} 
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeFilter === cat 
                  ? "bg-slate-900 text-white shadow-md" 
                  : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* --- Main Grid --- */}
        <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
          {filteredClubs.map((club) => (
            <div 
              key={club.id} 
              className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-sky-400 transition-all duration-300 shadow-sm"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
                  <LayoutGrid size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded">
                  {club.category || "General"}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">{club.name}</h3>
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-6">
                {club.desc || "Official student organization focusing on community and collaboration."}
              </p>

              <div className="flex items-center gap-6 mb-8 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-sky-600" />
                  <span className="text-sm font-bold text-slate-700">{club.members}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-emerald-500" />
                  <span className="text-sm font-bold text-slate-700">{club.events}</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedClub(club)} 
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-sky-600 transition-colors flex items-center justify-center gap-2"
              >
                Learn More <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </main>

        {/* --- Modal  --- */}
        {selectedClub && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-lg relative shadow-2xl overflow-hidden">
              <button 
                onClick={() => setSelectedClub(null)} 
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-900 mb-2">{selectedClub.name}</h2>
                <div className="flex gap-2">
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded uppercase">
                    <UserCheck size={12} /> Official
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl mb-8 border border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Club Description</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {selectedClub.desc || "Join this community to participate in official campus events and skill-sharing workshops."}
                </p>
              </div>

              {token ? (
                <form onSubmit={handleJoinClub} className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Join Request</label>
                  <textarea 
                    required
                    placeholder="Briefly explain why you'd like to join..."
                    className="w-full border-slate-200 border-2 rounded-xl p-4 text-sm focus:border-sky-500 transition outline-none h-32 bg-slate-50/50 resize-none"
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  />
                  <button 
                    disabled={joining} 
                    className="w-full py-4 bg-sky-600 text-white rounded-xl font-bold hover:bg-sky-700 transition-all disabled:opacity-50"
                  >
                    {joining ? "Processing..." : "Submit Join Request"}
                  </button>
                </form>
              ) : (
                <div className="text-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-500 text-sm mb-6">Login required to apply for memberships.</p>
                  <button 
                    onClick={() => navigate("/login")} 
                    className="px-10 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg"
                  >
                    Login to Join
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Club;