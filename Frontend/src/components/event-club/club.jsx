import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../home/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Users, Calendar, X, ArrowRight, LogIn, Sparkles } from "lucide-react";
import { useAuthContext } from "../../context/provider/AuthContext";
import apiUrl from "../../api";

/*  Category accent colours */
const CATEGORY_COLORS = {
  Tech:       { bg: "from-cyan-400/20 to-blue-500/20",    dot: "#38bdf8", text: "text-cyan-600"   },
  Art:        { bg: "from-rose-400/20 to-pink-500/20",    dot: "#fb7185", text: "text-rose-500"   },
  Music:      { bg: "from-violet-400/20 to-purple-500/20",dot: "#a78bfa", text: "text-violet-500" },
  Sports:     { bg: "from-emerald-400/20 to-teal-500/20", dot: "#34d399", text: "text-emerald-600"},
  Science:    { bg: "from-amber-400/20 to-orange-500/20", dot: "#fbbf24", text: "text-amber-600"  },
  General:    { bg: "from-slate-300/20 to-slate-400/20",  dot: "#94a3b8", text: "text-slate-500"  },
};

const accent = (cat) => CATEGORY_COLORS[cat] || CATEGORY_COLORS.General;

/* Club Card  */
const ClubCard = ({ club, index, onClick }) => {
  const { bg, dot, text } = accent(club.category);
  const initials = club.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Hover glow */}
      <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at 50% 0%, ${dot}33 0%, transparent 70%)` }} />

      <div className="relative bg-white border border-slate-100 rounded-2xl p-6 shadow-sm
        group-hover:shadow-xl group-hover:-translate-y-1
        transition-all duration-300 overflow-hidden">

        {/* Background gradient blob */}
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[4rem] bg-gradient-to-br ${bg} opacity-60`} />

        {/* Top row */}
        <div className="flex items-start justify-between mb-5 relative">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg text-white shadow-lg flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${dot}, ${dot}99)` }}>
            {initials}
          </div>

          {/* Category chip */}
          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${text}`}
            style={{ borderColor: `${dot}44`, background: `${dot}15` }}>
            {club.category}
          </span>
        </div>

        {/* Name + desc */}
        <h3 className="text-base font-black text-slate-900 mb-1.5 leading-snug group-hover:text-slate-700 transition-colors">
          {club.name}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-5">
          {club.desc || "No description available."}
        </p>

        {/* Stats + arrow */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Users className="w-3.5 h-3.5" />
              {club.members} <span className="font-normal">members</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              {club.events} <span className="font-normal">events</span>
            </span>
          </div>

          <div className="w-8 h-8 rounded-lg flex items-center justify-center
            bg-slate-100 group-hover:bg-slate-900
            text-slate-400 group-hover:text-white
            transition-all duration-300">
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

/*  Modal */
const ClubModal = ({ club, token, onClose, onNavigate }) => {
  const { dot, bg } = accent(club.category);
  const initials = club.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />

      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header band */}
        <div className={`relative h-28 bg-gradient-to-br ${bg} flex items-end px-7 pb-0`}
          style={{ background: `linear-gradient(135deg, ${dot}33 0%, ${dot}11 100%)` }}>
          {/* Large avatar */}
          <div className="absolute -bottom-6 left-7 w-16 h-16 rounded-2xl shadow-xl
            flex items-center justify-center text-2xl font-black text-white"
            style={{ background: `linear-gradient(135deg, ${dot}, ${dot}aa)` }}>
            {initials}
          </div>

          {/* Close */}
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white
              flex items-center justify-center text-slate-500 hover:text-slate-800
              transition-all shadow-sm">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 pt-10 pb-7">
          <span className="text-[10px] font-black uppercase tracking-widest"
            style={{ color: dot }}>
            {club.category}
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-1 mb-3">{club.name}</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            {club.desc || "No description available for this club."}
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3 mb-7">
            <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
              <p className="text-2xl font-black text-slate-900">{club.members}</p>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Members</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
              <p className="text-2xl font-black text-slate-900">{club.events}</p>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Events</p>
            </div>
          </div>

          {/* CTA */}
          {!token ? (
            <button
              onClick={() => onNavigate("/login")}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                bg-slate-900 hover:bg-slate-700 text-white font-bold text-sm
                transition-all duration-200 shadow-lg shadow-slate-900/20"
            >
              <LogIn className="w-4 h-4" />
              Login to Join
            </button>
          ) : (
            <button
              onClick={() => alert("Join request sent!")}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                text-white font-bold text-sm
                transition-all duration-200 shadow-lg"
              style={{ background: `linear-gradient(135deg, ${dot}, ${dot}cc)`,
                       boxShadow: `0 8px 24px ${dot}44` }}
            >
              <Sparkles className="w-4 h-4" />
              Request to Join
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* Main Page */
const Club = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { token } = useAuthContext();

  const showNavbar = location.pathname.startsWith("/clubs");

  const [clubs,        setClubs]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [searchTerm,   setSearchTerm]   = useState("");

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
          id:       c.club_id,
          name:     c.name,
          desc:     c.description || "",
          members:  c.members_names?.length || 0,
          events:   c.events_count || 0,
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

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-slate-50">
      {showNavbar && <Navbar />}
      <div className="flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-slate-800 animate-spin" />
        <p className="text-sm font-semibold text-slate-400 tracking-wide mt-4">Loading clubs…</p>
      </div>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="min-h-screen bg-slate-50">
      {showNavbar && <Navbar />}
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="bg-white border border-red-100 rounded-2xl p-8 text-center shadow-sm max-w-sm">
          <p className="text-red-500 font-bold mb-1">Something went wrong</p>
          <p className="text-sm text-slate-400">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Syne:wght@700;800&display=swap');
        .club-card-enter { animation: fadeUp 0.4s ease both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      {showNavbar && <Navbar />}

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden bg-slate-900 pt-16 pb-20 px-6">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #39D353 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #38bdf8 0%, transparent 70%)", filter: "blur(40px)" }} />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#39D353]" />
            <span className="text-xs font-bold text-white/70 tracking-widest uppercase">Discover & Join</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            Find Your <span style={{ color: "#39D353" }}>Community</span>
          </h1>
          <p className="text-slate-400 text-base max-w-md mx-auto mb-10">
            Browse clubs, explore events, and connect with people who share your passions.
          </p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              placeholder="Search clubs by name or description…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20
                text-white placeholder-slate-500 text-sm font-medium
                focus:outline-none focus:ring-2 focus:ring-[#39D353]/50 focus:border-[#39D353]/50
                backdrop-blur-sm transition-all"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm font-semibold text-slate-500">
            Showing <span className="text-slate-900 font-black">{filteredClubs.length}</span> of{" "}
            <span className="text-slate-900 font-black">{clubs.length}</span> clubs
            {searchTerm && <span className="text-slate-400"> for "<em>{searchTerm}</em>"</span>}
          </p>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Users className="w-3.5 h-3.5" />
            {clubs.reduce((s, c) => s + c.members, 0).toLocaleString()} total members
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        {filteredClubs.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Search className="w-7 h-7 text-slate-300" />
            </div>
            <h3 className="text-lg font-black text-slate-700 mb-1">No clubs found</h3>
            <p className="text-sm text-slate-400">Try a different search term</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClubs.map((club, i) => (
              <div key={club.id} className="club-card-enter" style={{ animationDelay: `${i * 50}ms` }}>
                <ClubCard
                  club={club}
                  index={i}
                  onClick={() => setSelectedClub(club)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {selectedClub && (
        <ClubModal
          club={selectedClub}
          token={token}
          onClose={() => setSelectedClub(null)}
          onNavigate={navigate}
        />
      )}
    </div>
  );
};

export default Club;