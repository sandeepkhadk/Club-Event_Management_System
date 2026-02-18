import React, { useState, useEffect } from "react";
import { Calendar, MapPin, User, Mail, Clock, X, ChevronRight } from "lucide-react";
import Navbar from "../home/navbar";
import { useAuthContext } from "../../context/provider/AuthContext";
import { useLocation } from "react-router-dom"; 


const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const location = useLocation();
  const { token } = useAuthContext();
  const showNavbar = location.pathname === '/events' || location.pathname.startsWith('/events/');
  

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    club: "",
  });

  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/events/global/");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        console.log(data)

        const gradients = [
          "from-blue-500 to-indigo-500",
          "from-purple-600 to-pink-500",
          "from-rose-500 to-orange-400",
          "from-emerald-500 to-teal-400"
        ];

        const formatted = data.events.map((e, index) => {
          const eventDate = new Date(e.start_datetime);
          return {
            id: e.event_id,
            name: e.title,
            club: e.club_name || "Campus Club",
            // For the badge
            month: eventDate.toLocaleString('en-US', { month: 'short' }),
            day: eventDate.getDate(),
            // For the details
            time: eventDate.toLocaleString([], { hour: '2-digit', minute: '2-digit' }),
            fullDate: eventDate.toLocaleDateString([], { dateStyle: 'medium' }),
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

  // ================= 2. JOIN HANDLER =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://127.0.0.1:8000/events/join/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, event_id: selectedEvent.id })
      });

      if (!res.ok) throw new Error("Registration failed. Are you logged in?");

      alert(`Success! You're on the list for ${selectedEvent.name}.`);
      setFormData({ name: "", email: "", contact: "", club: "" });
      setSelectedEvent(null);
    } catch (err) {
      alert(err.message);
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
        {/* Hero Header */}
        <header className="bg-slate-900 pt-20 pb-32 px-4 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
             <div className="absolute bottom-10 right-10 w-64 h-64 bg-rose-500 rounded-full blur-3xl"></div>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 relative z-10">
            Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400">Happenings</span>
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto relative z-10">
            Discover workshops, matches, and festivals organized by your fellow students.
          </p>
        </header>

        {/* Fancy Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 -mt-20 pb-20 relative z-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.length > 0 ? (
            events.map((event) => (
              <div 
                key={event.id} 
                className="group bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-white hover:border-indigo-100 transition-all duration-500 hover:-translate-y-3"
              >
                {/* Banner Area */}
                <div className={`h-44 bg-gradient-to-br ${event.banner} relative p-6`}>
                  <div className="flex justify-between items-start">
                    <div className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-widest">
                      Live Event
                    </div>
                    {/* Date Badge */}
                    <div className="bg-white rounded-2xl p-2 shadow-xl text-center min-w-[55px]">
                      <p className="text-[10px] font-black text-indigo-600 uppercase leading-none">{event.month}</p>
                      <p className="text-2xl font-black text-slate-800">{event.day}</p>
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6">
                     <p className="text-white/80 text-xs font-bold uppercase tracking-tighter mb-1">{event.club}</p>
                     <h2 className="text-white text-2xl font-black leading-tight group-hover:scale-105 transition-transform origin-left italic">
                       {event.name}
                     </h2>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-8 space-y-5">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-slate-500 text-sm font-semibold">
                      <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                        <Clock size={18} />
                      </div>
                      {event.fullDate} @ {event.time}
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-sm font-semibold">
                      <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
                        <MapPin size={18} />
                      </div>
                      {event.place}
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                    {event.about}
                  </p>

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
            ))
          ) : (
            <div className="col-span-full bg-white rounded-3xl p-20 text-center border-4 border-dashed border-slate-100">
               <Calendar className="mx-auto text-slate-200 mb-4" size={64} />
               <p className="text-slate-400 font-bold">No public events scheduled right now.</p>
            </div>
          )}
        </main>

       
      </div>
   
  );
};

export default EventPage;