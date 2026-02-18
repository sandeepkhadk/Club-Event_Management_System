import React, { useState, useEffect, useMemo, useCallback } from "react";
import Navbar from "../home/navbar";
import { useLocation } from "react-router-dom"; 

import { 
  Search, 
  Users, 
  Calendar, 
  X, 
  LayoutGrid, 
  ArrowRight, 
  UserCheck, 
  ShieldCheck,
  Info,
  LogIn,
  Loader2 
} from "lucide-react";
import { useAuthContext } from "../../context/provider/AuthContext";
import { useNavigate } from "react-router-dom";

const Club = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuthContext();
  const showNavbar = location.pathname === '/clubs' || location.pathname.startsWith('/clubs/');
  const [activeFilter, setActiveFilter] = useState("All");
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [joining, setJoining] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", reason: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["All", "Departments", "Technology", "Music & Arts"];
  const filteredClubs = useMemo(() => {
    let filtered = [...clubs];  // ← ALL CLUBS SHOWN
    if (activeFilter !== "All") {
      filtered = filtered.filter((c) => 
        c.category?.toLowerCase() === activeFilter.toLowerCase()
      );
    }
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((c) => 
        (c.name || "").toLowerCase().includes(searchLower) ||
        (c.desc || "").toLowerCase().includes(searchLower)
      );
    }
    return filtered;
  }, [clubs, activeFilter, searchTerm]);

  // Fetch user profile
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

  // Fetch clubs
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        setError(null);
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
        console.error("Clubs fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // UPDATE CLUB.jsx - Replace handleJoinClub function
  const handleJoinClub = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }
    
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
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || "Failed to join club");
      }
      
      const data = await res.json();
      alert("✅ Request sent to admin! Check your dashboard for status updates.");
      
      // Navigate to dashboard to see application status
      navigate("/student-dashboard");
      
    } catch (err) {
      console.error("Join club error:", err);
      alert(`❌ ${err.message}`);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-sky-50 flex flex-col">
        {showNavbar && <Navbar />}
        <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
          <div className="relative z-10 text-center max-w-md mx-auto space-y-8 animate-fade-in">
            <div className="absolute inset-0">
              <div className="absolute top-20 left-20 w-40 h-40 bg-sky-400/10 rounded-3xl blur-3xl animate-pulse" />
              <div className="absolute bottom-32 right-24 w-52 h-52 bg-indigo-400/10 rounded-3xl blur-3xl animate-pulse delay-1000" />
            </div>
            
            <div className="relative mx-auto">
              <div className="w-28 h-28 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 rounded-4xl shadow-2xl flex items-center justify-center mx-auto animate-spin" style={{animationDuration: '2s'}}>
                <Users className="w-14 h-14 text-white drop-shadow-2xl" />
              </div>
              <div className="absolute inset-0 w-28 h-28 mx-auto bg-white/40 backdrop-blur-sm rounded-4xl animate-ping delay-500" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-transparent tracking-tight">
                Loading Clubs
              </h2>
              <p className="text-lg text-slate-500 font-medium tracking-wide">
                Fetching official campus organizations...
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-8 opacity-70">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gradient-to-r from-slate-200 via-white to-slate-100 rounded-3xl animate-pulse shadow-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col">
        {showNavbar && <Navbar />}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md mx-auto text-center space-y-8">
            <div className="w-24 h-24 mx-auto bg-rose-100 rounded-3xl flex items-center justify-center shadow-2xl">
              <X className="w-12 h-12 text-rose-500" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-slate-900">Failed to Load</h2>
              <p className="text-slate-600 text-lg">{error}</p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-black rounded-3xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-xl"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-slate-900 antialiased flex flex-col">
      {showNavbar && <Navbar />}
      
      {/* 🔥 Hero Header - Medium */}
      <div className="flex-1 pt-0">
        <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 pt-4 pb-12 relative overflow-hidden shadow-sm">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 bg-clip-text text-transparent mb-6 tracking-tight leading-tight">
                Campus <span className="text-transparent bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text">Clubs</span>
              </h1>
              <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
                Discover official student organizations • Join communities that shape your campus experience
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-sky-500 transition-all" />
                <input 
                  type="text"
                  placeholder="Search clubs by name, interests..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-14 pr-16 py-4 lg:py-5 bg-white/70 backdrop-blur-xl border-2 border-slate-200/60 rounded-3xl focus:bg-white focus:border-sky-400 focus:ring-4 focus:ring-sky-500/20 shadow-xl transition-all duration-400 text-lg placeholder-slate-500 font-medium"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 bg-slate-100/50 px-2 py-1 rounded-xl backdrop-blur-sm font-mono">
                  esc
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 🔥 Filter Bar - Medium */}
        <div className="bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 sticky top-0 z-30 shadow-lg">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 py-6">
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mb-1">
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`group relative px-6 lg:px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 whitespace-nowrap ${
                    activeFilter === cat
                      ? "bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 text-white shadow-sky-500/40"
                      : "text-slate-700 hover:text-slate-900 bg-white/60 hover:bg-white/80 border-2 border-slate-200/60 hover:border-sky-300 shadow-slate-200/50"
                  }`}
                >
                  {activeFilter === cat && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent rounded-2xl blur-sm -skew-x-6 -translate-x-1 group-hover:translate-x-0 transition-all duration-700" />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              ))}
            </div>
            {filteredClubs.length === 0 && (
              <p className="text-center text-slate-500 text-lg font-medium py-6">
                No clubs found matching "{searchTerm}" in "{activeFilter}" category
              </p>
            )}
          </div>
        </div>

        {/* 🔥 MEDIUM CLUB GRID - 2 Columns */}
        <main className="max-w-5xl mx-auto px-6 lg:px-8 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 pb-32">
          {filteredClubs.map((club) => (
            <article 
              key={club.id}
              className="group relative bg-white/85 backdrop-blur-xl rounded-3xl border border-slate-200/70 p-8 lg:p-10 shadow-2xl hover:shadow-3xl hover:shadow-sky-500/10 hover:-translate-y-3 hover:border-sky-300/80 transition-all duration-700 overflow-hidden hover:bg-white h-full cursor-pointer"
              onClick={() => setSelectedClub(club)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/3 via-indigo-500/2 to-purple-500/2 opacity-0 group-hover:opacity-100 transition-all duration-1000" />
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="p-3 lg:p-4 bg-gradient-to-br from-slate-50 to-white/70 rounded-2xl text-slate-400 shadow-xl group-hover:bg-sky-50/80 group-hover:text-sky-600 transition-all duration-500 backdrop-blur-sm border border-slate-200/50">
                  <LayoutGrid className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                <span className="px-3 py-1.5 bg-white/60 backdrop-blur-sm text-xs font-black uppercase tracking-widest text-slate-600 rounded-xl border border-slate-200/70 group-hover:bg-sky-100/80 group-hover:text-sky-700 transition-all duration-400 shadow-md">
                  {club.category || "General"}
                </span>
              </div>

              <div className="relative z-10 space-y-4">
                <h3 className="text-2xl lg:text-3xl font-black text-slate-900 mb-3 group-hover:text-sky-600 transition-all duration-500 leading-tight line-clamp-2">
                  {club.name}
                </h3>
                
                <p className="text-slate-600 text-base lg:text-lg leading-relaxed line-clamp-3 px-1 opacity-90">
                  {club.desc || "Official student organization fostering community building and collaboration opportunities."}
                </p>

                <div className="flex items-center justify-between pt-6 pb-8 border-t border-slate-100/60 relative z-10">
                  <div className="flex items-center gap-3 p-3 lg:p-4 bg-gradient-to-br from-sky-50/80 to-indigo-50/50 backdrop-blur-sm rounded-2xl border border-sky-200/50 shadow-lg group-hover:shadow-xl transition-all">
                    <div className="p-2.5 bg-sky-100/80 rounded-xl backdrop-blur-sm border border-sky-200/40">
                      <Users className="w-5 h-5 text-sky-600" />
                    </div>
                    <span className="font-black text-xl lg:text-2xl text-slate-900">{club.members.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 lg:p-4 bg-gradient-to-br from-emerald-50/80 to-teal-50/50 backdrop-blur-sm rounded-2xl border border-emerald-200/50 shadow-lg group-hover:shadow-xl transition-all">
                    <div className="p-2.5 bg-emerald-100/80 rounded-xl backdrop-blur-sm border border-emerald-200/40">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="font-black text-xl lg:text-2xl text-slate-900">{club.events}</span>
                  </div>
                </div>

                <div className="pt-2 relative z-10">
                  <div className="group/btn relative w-full py-4 lg:py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 text-white rounded-3xl font-black text-lg uppercase tracking-widest shadow-2xl hover:shadow-sky-500/30 hover:shadow-3xl hover:from-sky-500 hover:via-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-4 focus:ring-sky-500/30 transition-all duration-700 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent rounded-3xl blur-sm -skew-x-12 -translate-x-6 group-hover/btn:translate-x-0 transition-transform duration-1000" />
                    <span className="relative flex items-center justify-center gap-3">
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-all duration-500" />
                      Explore Club
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </main>
      </div>

      {/* 🔥 MEDIUM MODAL - Perfect Size */}
      {selectedClub && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xl flex items-center justify-center z-50 p-4 lg:p-8 animate-in fade-in-50 zoom-in-95 duration-300">
          <div className="bg-white/95 backdrop-blur-3xl rounded-3xl p-8 lg:p-12 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-4xl border border-slate-200/60 relative animate-in slide-in-from-bottom-4 duration-500">
            
            <button 
              onClick={() => setSelectedClub(null)}
              className="group absolute top-6 right-6 p-3 lg:p-4 bg-white/70 hover:bg-white/90 rounded-3xl backdrop-blur-xl border-2 border-slate-200/60 hover:border-slate-300 shadow-2xl hover:shadow-3xl transition-all duration-400 hover:scale-105 hover:rotate-3 active:scale-95"
            >
              <X className="w-5 h-5 lg:w-6 lg:h-6 text-slate-600 group-hover:text-slate-900 transition-all" />
            </button>

            <div className="text-center mb-12 lg:mb-16 pt-4 lg:pt-8">
              <h2 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 bg-clip-text text-transparent mb-4 lg:mb-6 leading-tight">
                {selectedClub.name}
              </h2>
              <div className="inline-flex items-center gap-2 px-5 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-emerald-500/15 to-emerald-400/10 backdrop-blur-xl border-2 border-emerald-400/40 rounded-3xl text-emerald-700 font-black text-base lg:text-lg uppercase tracking-widest shadow-2xl">
                <UserCheck className="w-4 h-4 lg:w-5 lg:h-5" />
                Verified Official Club
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50/90 via-white/80 to-indigo-50/70 p-8 lg:p-10 rounded-3xl border-2 border-slate-200/50 backdrop-blur-2xl mb-10 lg:mb-12 shadow-2xl shadow-slate-200/50">
              <div className="flex items-start gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-sky-500/20 to-indigo-500/20 backdrop-blur-xl border border-sky-400/30 rounded-2xl text-sky-400 shrink-0 mt-1">
                  <Info className="w-6 h-6" />
                </div>
                <h4 className="text-xl lg:text-2xl font-black text-slate-900 mt-1 flex-1">About This Community</h4>
              </div>
              <p className="text-slate-700 text-lg lg:text-xl leading-relaxed whitespace-pre-wrap">
                {selectedClub.desc || "Join this vibrant student organization to participate in official campus events, workshops, networking opportunities, and community-building activities with fellow students."}
              </p>
            </div>

            {token ? (
              
                <form onSubmit={handleJoinClub} className="space-y-4">
                  <div>
                    <label className="text-xs lg:text-sm font-black text-slate-500 uppercase tracking-wider mb-3 block px-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 lg:w-4 lg:h-4 text-sky-600" />
                      Membership Application
                    </label>
                    <textarea 
                      required
                      placeholder="Why join this club? What can you contribute..."
                      className="w-full border-2 border-slate-200/60 rounded-2xl p-4 lg:p-5 text-base lg:text-lg focus:border-sky-400 focus:ring-3 focus:ring-sky-500/30 transition-all duration-400 bg-white/70 backdrop-blur-xl resize-vertical min-h-[120px] placeholder-slate-500 shadow-xl font-medium leading-relaxed"
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    />
                  </div>
                  
                  <button 
                    disabled={joining}
                    className="group relative w-full py-4 lg:py-5 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 text-white rounded-2xl font-black text-lg uppercase tracking-wide shadow-2xl hover:shadow-sky-500/40 hover:shadow-3xl hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-xl transition-all duration-500 overflow-hidden flex items-center justify-center gap-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/15 to-transparent rounded-2xl blur -skew-x-12 -translate-x-6 group-hover:translate-x-0 transition-transform duration-700" />
                    {joining ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                        <span className="relative z-10 tracking-wide">Processing...</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-6 h-6 group-hover:scale-110 transition-transform duration-300 shrink-0" />
                        <span className="relative z-10 tracking-wide">Submit Application</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-slate-50/90 via-white/80 to-indigo-50/70 rounded-xl border-2 border-dashed border-slate-200/60 backdrop-blur-xl shadow-xl">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 mx-auto mb-4 bg-gradient-to-br from-sky-500/20 to-indigo-500/20 backdrop-blur-xl border-2 border-sky-400/40 rounded-xl flex items-center justify-center shadow-lg">
                    <LogIn className="w-7 h-7 lg:w-8 lg:h-8 text-sky-600" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-black text-slate-900 mb-3 leading-tight">Login Required</h3>
                  <p className="text-sm lg:text-base text-slate-600 mb-4 max-w-xs mx-auto leading-relaxed font-medium">
                    Sign in to apply for club memberships
                  </p>
                  <button 
                    onClick={() => navigate("/login")}
                    className="px-6 lg:px-8 py-2.5 lg:py-3 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 text-white rounded-xl font-black text-base uppercase tracking-wide hover:from-sky-500 hover:via-indigo-500 hover:to-purple-600 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all duration-400 shadow-lg flex items-center gap-1.5 mx-auto group"
                  >
                    <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Sign In
                  </button>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Club;
