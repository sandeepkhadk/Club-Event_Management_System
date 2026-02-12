// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { X, LogOut, Users, Calendar, Clock, ChevronRight, CheckCircle2, Timer, Activity, Mail, User, Sparkles } from "lucide-react";

// const StudentDashboard = () => {
//   const navigate = useNavigate();
//   const { token, logout } = useAuthContext();

//   const [clubs, setClubs] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [myApplications, setMyApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false); // Added this state

//   const [selectedClub, setSelectedClub] = useState(null);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [formData, setFormData] = useState({ name: "", email: "", reason: "" });

//   // 1. FETCH DATA ON LOAD
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const [clubRes, eventRes, profileRes] = await Promise.all([
//           fetch("http://127.0.0.1:8000/clubs/"),
//           fetch("http://127.0.0.1:8000/events/"),
//           fetch("http://127.0.0.1:8000/users/profile/", {
//             headers: { "Authorization": `Bearer ${token}` }
//           })
//         ]);

//         const clubData = await clubRes.json();
//         const eventData = await eventRes.json();
//         const profileData = await profileRes.json();

//         setClubs(clubData.clubs || []);
//         setEvents(eventData.events || []);
//         setMyApplications(profileData.applications || []); 

//         setFormData(prev => ({
//           ...prev,

//           user_id: profileData.user_id,
//           name: profileData.name || profileData.username || "Student",
//           email: profileData.email || "student@college.edu"
//         }));
//       } catch (err) {
//         console.error("Sync error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (token) fetchDashboardData();
//   }, [token]);

//   // 2. LOGOUT HANDLER
//   const handleLogout = () => { logout(); navigate("/"); };

//   // 3. CLUB SUBMIT HANDLER
//   const handleClubSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const response = await fetch(`http://127.0.0.1:8000/users/join-club/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           // reason: formData.reason,
//           // full_name: formData.name,
//           // email: formData.email
//             club_id: selectedClub.club_id,
//             user_id: profileData.user_id,
          
//         })
//       });

//       if (!response.ok) throw new Error("Failed to submit application");
      
//       alert(`Application sent to ${selectedClub.name}!`);
//       setFormData({ ...formData, reason: "" });
//       setSelectedClub(null);
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // 4. EVENT SUBMIT HANDLER
//   const handleEventSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const response = await fetch(`http://127.0.0.1:8000/events/${selectedEvent.event_id}/register/`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       });

//       if (!response.ok) throw new Error("Failed to register for event");

//       alert(`Successfully registered for ${selectedEvent.title}!`);
//       setSelectedEvent(null);
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <div className="h-screen flex items-center justify-center font-black text-slate-400 animate-pulse">LOADING DASHBOARD...</div>;

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-32">
      
//       {/* --- TOP NAV --- */}
//       <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
//           <div className="flex items-center gap-2">
//             <div className="bg-indigo-600 p-2 rounded-xl text-white"><Sparkles size={20}/></div>
//             <h1 className="font-black text-xl tracking-tighter uppercase italic">Campus<span className="text-indigo-600">Core</span></h1>
//           </div>
//           <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-rose-600 font-bold transition-colors text-xs uppercase tracking-widest">
//             <LogOut size={16} /> Sign Out
//           </button>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-6 mt-12 space-y-12">
        
//         {/* --- 1. APPROVAL TRACKER --- */}
//         <section>
//           <div className="flex items-center gap-2 mb-6 px-2">
//             <Activity className="text-indigo-600" size={20} />
//             <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Application Tracker</h2>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {myApplications.length > 0 ? myApplications.map((app, idx) => (
//               <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
//                 <div>
//                   <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{app.club_name}</p>
//                   <p className="text-sm font-bold text-slate-800">Membership</p>
//                 </div>
//                 {app.status === "Approved" ? (
//                   <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl flex items-center gap-1">
//                     <CheckCircle2 size={16} />
//                     <span className="text-[10px] font-black uppercase">Approved</span>
//                   </div>
//                 ) : (
//                   <div className="bg-amber-50 text-amber-600 p-2 rounded-xl flex items-center gap-1">
//                     <Timer size={16} />
//                     <span className="text-[10px] font-black uppercase">Pending</span>
//                   </div>
//                 )}
//               </div>
//             )) : (
//               <div className="col-span-full py-6 px-6 bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-2xl text-center">
//                 <p className="text-slate-400 text-sm font-medium italic">No applications found. Start by joining a club below!</p>
//               </div>
//             )}
//           </div>
//         </section>

//         {/* --- 2. EVENTS SECTION --- */}
//         <section>
//           <div className="flex items-center gap-3 mb-8 px-2">
//             <Calendar className="text-indigo-600" size={24} />
//             <h2 className="text-2xl font-black text-slate-800">Live Events</h2>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {events.map(event => (
//               <div key={event.event_id} className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center gap-6 hover:shadow-lg transition-all">
//                 <div className="w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center shrink-0">
//                   <span className="text-indigo-600 font-black text-xl">{new Date(event.start_datetime).getDate()}</span>
//                   <span className="text-[9px] font-black uppercase text-slate-400">{new Date(event.start_datetime).toLocaleString('default', { month: 'short' })}</span>
//                 </div>
//                 <div className="flex-1">
//                   <h4 className="font-black text-lg text-slate-800 mb-1">{event.title}</h4>
//                   <div className="flex gap-4 text-slate-400 text-[10px] font-bold uppercase">
//                     <span className="flex items-center gap-1"><Clock size={12}/> {new Date(event.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
//                   </div>
//                 </div>
//                 <button 
//                   onClick={() => setSelectedEvent(event)} 
//                   className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors"
//                 >
//                   Register
//                 </button>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* --- 3. CLUBS SECTION --- */}
//         <section>
//           <div className="flex items-center gap-3 mb-8 px-2">
//             <Users className="text-indigo-600" size={24} />
//             <h2 className="text-2xl font-black text-slate-800">Explore Clubs</h2>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {clubs.map(club => (
//               <div key={club.club_id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-indigo-200 hover:shadow-2xl transition-all group">
//                 <h4 className="text-xl font-black mb-2 group-hover:text-indigo-600 transition-colors">{club.name}</h4>
//                 <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed">{club.description || "Join us to learn new skills and connect with peers."}</p>
//                 <button 
//                   onClick={() => setSelectedClub(club)}
//                   className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
//                 >
//                   Apply to Join <ChevronRight size={14} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </section>
//       </main>

//       {/* --- FORM MODAL --- */}
//       {(selectedClub || selectedEvent) && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
//           <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl relative animate-in zoom-in duration-200">
//             <button 
//               onClick={() => { setSelectedClub(null); setSelectedEvent(null); }} 
//               className="absolute top-8 right-8 text-slate-400 hover:text-slate-900"
//             >
//               <X />
//             </button>
            
//             <h3 className="text-2xl font-black mb-1">{selectedClub ? "Club Application" : "Event Registration"}</h3>
//             <p className="text-slate-500 text-sm mb-8 font-medium italic">{selectedClub?.name || selectedEvent?.title}</p>

//             <form onSubmit={selectedClub ? handleClubSubmit : handleEventSubmit} className="space-y-5">
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
//                 <div className="relative">
//                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
//                   <input type="text" readOnly value={formData.name} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 font-bold outline-none cursor-not-allowed" />
//                 </div>
//               </div>

//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
//                 <div className="relative">
//                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
//                   <input type="email" readOnly value={formData.email} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 font-bold outline-none cursor-not-allowed" />
//                 </div>
//               </div>

//               {selectedClub && (
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reason for joining</label>
//                   <textarea 
//                     required 
//                     className="w-full p-4 bg-white border-2 border-slate-50 rounded-xl focus:border-indigo-500 outline-none h-24 resize-none font-medium text-sm transition-all" 
//                     value={formData.reason} 
//                     onChange={e => setFormData({...formData, reason: e.target.value})} 
//                   />
//                 </div>
//               )}

//               <button 
//                 type="submit" 
//                 disabled={submitting}
//                 className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-indigo-700 shadow-xl shadow-indigo-100 disabled:opacity-50 transition-all"
//               >
//                 {submitting ? "Processing..." : "Confirm"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentDashboard;
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { X, LogOut, Users, Calendar, Clock, ChevronRight, CheckCircle2, Timer, Activity, Mail, User, Sparkles } from "lucide-react";
import { useAuthContext } from "../../context/provider/AuthContext";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuthContext();

  // Data States
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Form & User State
  const [formData, setFormData] = useState({ 
    user_id: "", 
    name: "", 
    email: "", 
    reason: "" 
  });

  // --- 1. FETCH DATA FUNCTION (Memoized for reuse) ---
  const fetchDashboardData = useCallback(async () => {
    if (!token) return;
    try {
      const [clubRes, eventRes, profileRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/clubs/"),
        fetch("http://127.0.0.1:8000/events/"),
        fetch("http://127.0.0.1:8000/users/profile/", {
          headers: { "Authorization": `Bearer ${token}` }
        })
      ]);

      const clubData = await clubRes.json();
      const eventData = await eventRes.json();
      const profileData = await profileRes.json();

      setClubs(clubData.clubs || []);
      setEvents(eventData.events || []);
      setMyApplications(profileData.applications || []); 

      setFormData(prev => ({
        ...prev,
        user_id: profileData.user_id,
        name: profileData.name || profileData.username || "Student",
        email: profileData.email || "student@college.edu"
      }));
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // --- 2. HANDLERS ---
  const handleLogout = () => { logout(); navigate("/"); };

  const handleClubSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/users/join-club/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          club_id: selectedClub.club_id,
          user_id: formData.user_id,
          reason: formData.reason
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to submit application");
      }
      
      alert(`Application sent to ${selectedClub.name}!`);
      setFormData(prev => ({ ...prev, reason: "" }));
      setSelectedClub(null);
      fetchDashboardData(); // Refresh tracker to show "Pending"
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/events/${selectedEvent.event_id}/register/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: formData.user_id,
          club_id: selectedEvent.club_id
        })
      });

      if (!response.ok) throw new Error("Failed to register for event");

      alert(`Successfully registered for ${selectedEvent.title}!`);
      setSelectedEvent(null);
      fetchDashboardData(); // Refresh in case profile tracks events
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // --- 3. LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="bg-indigo-600 p-4 rounded-2xl text-white animate-bounce mb-4">
          <Sparkles size={32}/>
        </div>
        <h2 className="font-black text-slate-400 uppercase tracking-widest text-sm">Syncing Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-32">
      
      {/* --- TOP NAV --- */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl text-white"><Sparkles size={20}/></div>
            <h1 className="font-black text-xl tracking-tighter uppercase italic">Campus<span className="text-indigo-600">Core</span></h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-rose-600 font-bold transition-colors text-xs uppercase tracking-widest">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-12 space-y-12">
        
        {/* --- SECTION 1: APPROVAL TRACKER --- */}
        <section>
          <div className="flex items-center gap-2 mb-6 px-2">
            <Activity className="text-indigo-600" size={20} />
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Application Tracker</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {myApplications.length > 0 ? myApplications.map((app, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{app.club_name}</p>
                  <p className="text-sm font-bold text-slate-800">Membership</p>
                </div>
                {app.status === "Approved" ? (
                  <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl flex items-center gap-1">
                    <CheckCircle2 size={16} />
                    <span className="text-[10px] font-black uppercase">Approved</span>
                  </div>
                ) : (
                  <div className="bg-amber-50 text-amber-600 p-2 rounded-xl flex items-center gap-1">
                    <Timer size={16} />
                    <span className="text-[10px] font-black uppercase">Pending</span>
                  </div>
                )}
              </div>
            )) : (
              <div className="col-span-full py-6 px-6 bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                <p className="text-slate-400 text-sm font-medium italic">No applications found. Start by joining a club below!</p>
              </div>
            )}
          </div>
        </section>

        {/* --- SECTION 2: LIVE EVENTS --- */}
        <section>
          <div className="flex items-center gap-3 mb-8 px-2">
            <Calendar className="text-indigo-600" size={24} />
            <h2 className="text-2xl font-black text-slate-800">Live Events</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map(event => (
              <div key={event.event_id} className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center gap-6 hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center shrink-0">
                  <span className="text-indigo-600 font-black text-xl">{new Date(event.start_datetime).getDate()}</span>
                  <span className="text-[9px] font-black uppercase text-slate-400">{new Date(event.start_datetime).toLocaleString('default', { month: 'short' })}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-lg text-slate-800 mb-1">{event.title}</h4>
                  <div className="flex gap-4 text-slate-400 text-[10px] font-bold uppercase">
                    <span className="flex items-center gap-1"><Clock size={12}/> {new Date(event.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedEvent(event)} 
                  className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors"
                >
                  Register
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTION 3: CLUBS --- */}
        <section>
          <div className="flex items-center gap-3 mb-8 px-2">
            <Users className="text-indigo-600" size={24} />
            <h2 className="text-2xl font-black text-slate-800">Explore Clubs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {clubs.map(club => (
              <div key={club.club_id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-indigo-200 hover:shadow-2xl transition-all group">
                <h4 className="text-xl font-black mb-2 group-hover:text-indigo-600 transition-colors">{club.name}</h4>
                <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed">{club.description || "Join us to learn new skills and connect with peers."}</p>
                <button 
                  onClick={() => setSelectedClub(club)}
                  className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  Apply to Join <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* --- MODAL FORM --- */}
      {(selectedClub || selectedEvent) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl relative animate-in zoom-in duration-200">
            <button 
              onClick={() => { setSelectedClub(null); setSelectedEvent(null); }} 
              className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-transform hover:scale-110"
            >
              <X />
            </button>
            
            <h3 className="text-2xl font-black mb-1">{selectedClub ? "Club Application" : "Event Registration"}</h3>
            <p className="text-slate-500 text-sm mb-8 font-medium italic">{selectedClub?.name || selectedEvent?.title}</p>

            <form onSubmit={selectedClub ? handleClubSubmit : handleEventSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input type="text" readOnly value={formData.name} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 font-bold outline-none cursor-not-allowed" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input type="email" readOnly value={formData.email} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 font-bold outline-none cursor-not-allowed" />
                </div>
              </div>

              {selectedClub && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reason for joining</label>
                  <textarea 
                    required 
                    className="w-full p-4 bg-white border-2 border-slate-50 rounded-xl focus:border-indigo-500 outline-none h-24 resize-none font-medium text-sm transition-all" 
                    placeholder="Why do you want to join this club?"
                    value={formData.reason} 
                    onChange={e => setFormData({...formData, reason: e.target.value})} 
                  />
                </div>
              )}

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-indigo-700 shadow-xl shadow-indigo-100 disabled:opacity-50 transition-all flex items-center justify-center"
              >
                {submitting ? (
                   <span className="flex items-center gap-2">
                     <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Processing
                   </span>
                ) : "Confirm Submission"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;