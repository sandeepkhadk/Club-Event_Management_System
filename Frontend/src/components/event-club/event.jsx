import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, X, ChevronRight, LogIn, Users, Loader2 } from "lucide-react";
import Navbar from "../home/Navbar";
import { useAuthContext } from "../../context/provider/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import apiUrl from "../../api";

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { token } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const showNavbar = location.pathname === "/events" || location.pathname.startsWith("/events/");

  const [formData, setFormData] = useState({ name: "", email: "", contact: "" });
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${apiUrl}/events/global/`);
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();

        const gradients = [
          "from-blue-500 to-indigo-500",
          "from-purple-600 to-pink-500",
          "from-rose-500 to-orange-400",
          "from-emerald-500 to-teal-400",
        ];

        const formatted = data.events.map((e, index) => {
          const eventDate = new Date(e.start_datetime);
          return {
            id: e.event_id,
            name: e.title,
            club: e.club_name || "Campus Club",
            month: eventDate.toLocaleString("en-US", { month: "short" }),
            day: eventDate.getDate(),
            time: eventDate.toLocaleString([], { hour: "2-digit", minute: "2-digit" }),
            fullDate: eventDate.toLocaleDateString([], { dateStyle: "medium" }),
            place: e.location || "Main Campus",
            about: e.description || "No description provided.",
            contactName: e.organizer_name || "Club Lead",
            contactEmail: e.organizer_email || "admin@campus.edu",
            banner: gradients[index % gradients.length],
          };
        });

        setEvents(formatted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Prefill form if logged in
  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${apiUrl}/users/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setFormData({
          name: data.name || data.username || "",
          email: data.email || "",
          contact: "",
        });
      } catch (err) {
        console.error("Profile fetch failed:", err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }
    setJoining(true);
    try {
      const res = await fetch(`${apiUrl}/events/join/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formData, event_id: selectedEvent.id }),
      });
      if (!res.ok) throw new Error("Failed to join event");

      alert(`✅ Successfully joined ${selectedEvent.name}`);
      setSelectedEvent(null);
      setFormData({ name: "", email: "", contact: "" });
    } catch (err) {
      alert(err.message);
    } finally {
      setJoining(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
      {showNavbar && <Navbar />}
      <div className="animate-bounce text-indigo-600 font-black text-2xl">Loading Events...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {showNavbar && <Navbar />}

      {/* Events Grid */}
      {/* Events Grid */}
<main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20 relative z-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {events.length > 0 ? events.map((event) => (
    <div
      key={event.id}
      className="group bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-white hover:border-indigo-100 transition-all duration-500 hover:-translate-y-3"
    >
      <div className={`h-44 bg-gradient-to-br ${event.banner} relative p-6`}>
        <div className="flex justify-between items-start">
          <div className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-widest">
            Live Event
          </div>
          <div className="bg-white rounded-2xl p-2 shadow-xl text-center min-w-[55px]">
            <p className="text-[10px] font-black text-indigo-600 uppercase leading-none">{event.month}</p>
            <p className="text-2xl font-black text-slate-800">{event.day}</p>
          </div>
        </div>
        <div className="absolute bottom-6 left-6">
          <p className="text-white/80 text-xs font-bold uppercase tracking-tighter mb-1">{event.club}</p>
          <h2 className="text-white text-2xl font-black leading-tight group-hover:scale-105 transition-transform origin-left italic">{event.name}</h2>
        </div>
      </div>

      <div className="p-8 space-y-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-slate-500 text-sm font-semibold">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><Clock size={18} /></div>
            {event.fullDate} @ {event.time}
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-sm font-semibold">
            <div className="p-2 bg-rose-50 rounded-xl text-rose-600"><MapPin size={18} /></div>
            {event.place}
          </div>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{event.about}</p>
        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Organizer</span>
            <span className="text-xs font-black text-slate-700">{event.contactName}</span>
          </div>
          <button
            onClick={() => setSelectedEvent(event)}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200 hover:shadow-indigo-200"
          >
            Join <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )) : (
    <div className="col-span-full bg-white rounded-3xl p-20 text-center border-4 border-dashed border-slate-100">
      <Calendar className="mx-auto text-slate-200 mb-4" size={64} />
      <p className="text-slate-400 font-bold">No public events scheduled right now.</p>
    </div>
  )}
</main>


      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xl flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-3xl rounded-3xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl relative">
            <button onClick={() => setSelectedEvent(null)} className="absolute top-6 right-6 p-3 bg-white/70 rounded-3xl shadow-xl">
              <X className="w-5 h-5 text-slate-600" />
            </button>

            <h2 className="text-3xl font-black mb-4">{selectedEvent.name}</h2>
            <p className="text-slate-700 mb-6">{selectedEvent.about}</p>

            {token ? (
              <form onSubmit={handleJoin} className="space-y-4">
                <input
                  required
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border-2 border-slate-200/60 rounded-2xl p-4 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 transition-all"
                />
                <input
                  required
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border-2 border-slate-200/60 rounded-2xl p-4 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 transition-all"
                />
                <textarea
                  placeholder="Contact / Message"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full border-2 border-slate-200/60 rounded-2xl p-4 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 transition-all min-h-[100px]"
                />
                <button
                  type="submit"
                  disabled={joining}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  {joining ? <Loader2 className="w-5 h-5 animate-spin" /> : <Users className="w-5 h-5" />}
                  {joining ? "Processing..." : "Join Event"}
                </button>
              </form>
            ) : (
              <div className="text-center p-6 bg-gradient-to-br from-slate-50/90 via-white/80 to-indigo-50/70 rounded-xl border-2 border-dashed border-slate-200/60 backdrop-blur-xl shadow-xl">
                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center bg-indigo-100 rounded-xl">
                  <LogIn className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Login Required</h3>
                <p className="text-sm text-slate-600 mb-4">Sign in to register for this event.</p>
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
                >
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

export default EventPage;
