
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Users, Calendar, Activity, Sparkles, Home, Plus } from "lucide-react";
import { useAuthContext } from "../../context/provider/AuthContext";
import EventList from "../admin/EventList";
import { useUserRole } from "../../context/hooks/useUserRole";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const decoded = useUserRole();
  const user_id = decoded?.user_id; // ✅ FIXED: Optional chaining
  const { token, logout } = useAuthContext();

  // --- State ---
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [myClubs, setMyClubs] = useState([]); // ✅ ADDED: Missing state
  const [clubEvents, setClubEvents] = useState({}); // ✅ ADDED: Missing state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ✅ ADDED: Club status helper
  const getClubStatus = (clubId) => {
    const pendingApp = myApplications.find(app => app.club_id === clubId);
    const approvedClub = myClubs.find(club => club.club_id === clubId);
    if (approvedClub) return 'approved';
    if (pendingApp) return 'pending';
    return 'available';
  };

  // --- Fetch dashboard data ---
  const fetchDashboardData = useCallback(async () => {
    if (!token || !user_id) return; // ✅ FIXED: Added user_id check
    setLoading(true);
    try {
      const [clubRes, eventRes, profileRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/clubs/"),
        fetch("http://127.0.0.1:8000/events/global/"),
        fetch("http://127.0.0.1:8000/users/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const clubData = await clubRes.json();
      const eventData = await eventRes.json();
      const profileData = await profileRes.json();

      setClubs(clubData.clubs || []);
      setMyApplications(profileData.applications || []);
      setMyProfile(profileData);
      setMyClubs(profileData.approved_clubs || []); // ✅ FIXED: Set myClubs

      // Map events with proper joined status
      const mappedEvents = (eventData.events || []).map((e) => ({
        ...e,
        joined: e.joined_users?.includes(user_id) || false,
      }));
      setEvents(mappedEvents);

      // Club-specific events
      const clubEventsMap = {};
      myClubs.forEach(club => {
        clubEventsMap[club.club_id] = mappedEvents.filter(e => e.club_id === club.club_id);
      });
      setClubEvents(clubEventsMap);

    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [token, user_id]); // ✅ FIXED: Added user_id dependency

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // --- Logout ---
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // --- Join Club ---
  const handleClubJoin = async (club_id) => {
    const status = getClubStatus(club_id);
    
    if (status === 'pending') {
      alert("Request pending! Please wait for approval.");
      return;
    }
    if (status === 'approved') {
      alert("You're already a member!");
      return;
    }

    if (!token) {
      alert("Not authenticated");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/users/join-club/${club_id}/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to send request");
      }
      
      alert(`✅ ${data.message}`);
      fetchDashboardData();
    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // --- FIXED Event handlers ---
  const handleJoinEvent = async (event) => {
    try {
      if (!token) throw new Error("You must be logged in.");
      
      const eventId = event.id || event.event_id; // ✅ FIXED: Handle both ID formats
      const res = await fetch(`http://127.0.0.1:8000/events/join/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event_id: eventId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to join event");
      }

      setEvents(prevEvents =>
        prevEvents.map(e =>
          (e.id === eventId || e.event_id === eventId)
            ? { ...e, joined_users: [...(e.joined_users || []), user_id], joined: true } // ✅ FIXED: Use user_id
            : e
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLeaveEvent = async (event) => {
    try {
      if (!token) throw new Error("You must be logged in.");
      
      const eventId = event.id || event.event_id;
      const res = await fetch(`http://127.0.0.1:8000/events/leave/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event_id: eventId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to leave event");
      }

      setEvents(prevEvents =>
        prevEvents.map(e =>
          (e.id === eventId || e.event_id === eventId)
            ? { ...e, joined_users: (e.joined_users || []).filter(uid => uid !== user_id), joined: false } // ✅ FIXED: Use user_id
            : e
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // ✅ ADDED: Club event handler
  const handleJoinClubEvent = async (event, clubId) => {
    try {
      if (!token) throw new Error("You must be logged in.");
      
      const eventId = event.id || event.event_id;
      const res = await fetch(`http://127.0.0.1:8000/events/join/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event_id: eventId }),
      });

      if (!res.ok) throw new Error("Failed to join event");

      setClubEvents(prev => ({
        ...prev,
        [clubId]: prev[clubId]?.map(e =>
          (e.id === eventId || e.event_id === eventId)
            ? { ...e, joined: true, joined_users: [...(e.joined_users || []), user_id] }
            : e
        )
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center p-8">
        <div className="text-center max-w-md mx-auto space-y-6">
          <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="w-12 h-12 text-white drop-shadow-lg" />
          </div>
          <h2 className="text-4xl font-black bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent tracking-tight">
            Syncing Dashboard
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-slate-900 antialiased">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 group">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg group-hover:scale-105 transition-all">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
                Student Dashboard
              </h1>
              {myProfile && (
                <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Welcome, {myProfile.username || myProfile.name}
                </p>
              )}
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-rose-600 bg-slate-100/50 hover:bg-rose-50 rounded-2xl border hover:border-rose-200 transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24 space-y-20">
        {/* 🔥 1. APPLICATION TRACKER */}
        <section aria-labelledby="applications-title">
          <header className="flex items-center gap-3 mb-10 pb-8 border-b border-slate-200">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 id="applications-title" className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Application Tracker
              </h2>
              <p className="text-slate-500 mt-2 text-lg">
                {myApplications.length} active request{myApplications.length !== 1 ? 's' : ''}
              </p>
            </div>
          </header>

          {myApplications.length ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {myApplications.map((app, idx) => (
                <article key={idx} className="group bg-gradient-to-r from-indigo-50/80 to-purple-50/60 backdrop-blur-xl border border-indigo-200/60 hover:border-indigo-300 p-8 lg:p-10 rounded-4xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity -skew-x-3" />
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl flex-shrink-0">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600">
                            {app.club_name}
                          </h3>
                          <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mt-1">
                            Membership Request
                          </p>
                        </div>
                      </div>
                      
                      <div className={`px-6 py-3 rounded-3xl font-black text-sm uppercase tracking-widest shadow-lg flex items-center gap-2 ${
                        app.status === "Approved" 
                          ? "bg-emerald-500/90 text-white shadow-emerald-500/25 animate-pulse" 
                        : app.status === "Rejected" 
                          ? "bg-rose-500/90 text-white shadow-rose-500/25" 
                          : "bg-amber-500/90 text-white shadow-amber-500/25 animate-pulse"
                      }`}>
                        {app.status || "Pending"}
                      </div>
                    </div>

                    {app.reason && (
                      <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/50 shadow-xl">
                        <p className="text-slate-700 text-base leading-relaxed italic">
                          "{app.reason}"
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-6 border-t border-slate-200/50">
                      <span className="text-sm font-bold text-slate-500 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(app.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="p-20 lg:p-24 bg-gradient-to-br from-indigo-50/70 to-purple-50/50 backdrop-blur-xl border-2 border-dashed border-indigo-200/60 rounded-4xl text-center shadow-2xl">
              <div className="w-28 h-28 bg-gradient-to-br from-slate-100/60 to-indigo-100/60 backdrop-blur-xl rounded-4xl flex items-center justify-center mx-auto mb-10 border-2 border-slate-200/50 shadow-xl">
                <Users className="w-14 h-14 text-slate-500" />
              </div>
              <h3 className="text-3xl lg:text-4xl font-black text-slate-800 mb-6">
                No Applications Yet
              </h3>
              <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
                Apply to clubs and track your membership requests here.
              </p>
            </div>
          )}
        </section>

        {/* 🔥 2. MY CLUBS */}
        {myClubs.length > 0 && (
          <section>
            <header className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-200">
              <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-xl">
                <Home className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  My Clubs
                </h2>
                <p className="text-slate-500 mt-2 text-lg">{myClubs.length} active communities</p>
              </div>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {myClubs.map((club) => (
                <article key={club.club_id} className="group bg-white/70 backdrop-blur-xl rounded-4xl border border-slate-200/50 p-10 shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="flex items-start gap-6 mb-8 pb-8 border-b border-slate-200/50">
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all shrink-0">
                        <Users className="w-9 h-9 text-white" />
                      </div>
                      <div className="min-w-0 flex-1 pt-2">
                        <h3 className="text-3xl font-black text-slate-900 group-hover:text-indigo-600 mb-2">
                          {club.name}
                        </h3>
                        <p className="text-slate-500 text-lg">{club.description || "Your club home base"}</p>
                      </div>
                    </div>
                    
                    <h4 className="font-black text-xl text-slate-800 mb-6 flex items-center gap-3 pb-4 border-b border-slate-200/30">
                      <Calendar className="w-6 h-6 text-indigo-500" />
                      Club Events
                    </h4>
                    {clubEvents[club.club_id]?.length > 0 ? (
                      <EventList
                        events={clubEvents[club.club_id]}
                        onJoin={(event) => handleJoinClubEvent(event, club.club_id)}
                        onLeave={handleLeaveEvent}
                        currentUserId={user_id}
                        club_role={null}
                        onDelete={null}
                      />
                    ) : (
                      <div className="text-center py-16 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-3xl border-2 border-dashed border-slate-200/50">
                        <Calendar className="mx-auto h-16 w-16 text-slate-300 mb-6" />
                        <h5 className="text-xl font-bold text-slate-500 mb-3">No Events Yet</h5>
                        <p className="text-slate-400 mb-8">Stay tuned for upcoming events.</p>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 🔥 3. LIVE EVENTS */}
        <section>
          <header className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-200">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-xl">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Live Events
              </h2>
              <p className="text-slate-500 mt-2 text-lg">Join exciting activities across campus</p>
            </div>
          </header>
          <EventList
            events={events}
            onJoin={handleJoinEvent}
            onLeave={handleLeaveEvent}
            currentUserId={user_id}
            club_role={null}
            onDelete={null}
          />
        </section>


      {/* 🔥 4. EXPLORE CLUBS - ELEVATED FEATURED CARDS */}
      <section aria-labelledby="explore-clubs-title">
        <header className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-200">
          <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-xl">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 id="explore-clubs-title" className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Explore Clubs
            </h2>
            <p className="text-slate-500 mt-2 text-lg">Discover your next passion</p>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clubs.map((club) => {
            const status = getClubStatus(club.club_id);
            const pendingApp = myApplications.find(app => app.club_id === club.club_id);
            
            return (
              <article
                key={club.club_id}
                className="group relative bg-white/70 backdrop-blur-xl rounded-4xl border border-slate-200/50 p-10 shadow-2xl hover:shadow-3xl hover:-translate-y-4 hover:border-indigo-300/70 transition-all duration-500 overflow-hidden hover:bg-white"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/3 to-purple-500/3 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-indigo-100 transition-all duration-300 mx-auto">
                    <Users className="w-10 h-10 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 mb-4 text-center group-hover:text-indigo-600 transition-colors leading-tight">
                    {club.name}
                  </h3>
                  
                  <p className="text-slate-500 text-lg mb-10 text-center leading-relaxed line-clamp-3 px-4">
                    {club.description || "Join us to learn new skills and connect with peers who share your interests."}
                  </p>
                  
                  {/* 🔥 ENHANCED DYNAMIC BUTTON */}
                  <div className="space-y-3">
                    {status === 'approved' ? (
                      <div className="w-full p-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-3xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl animate-pulse">
                        <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                        Active Member
                      </div>
                    ) : status === 'pending' ? (
                      <div className="w-full p-5 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 rounded-3xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl opacity-90">
                        <div className="w-3 h-3 bg-amber-900 rounded-full animate-ping" />
                        Request Pending
                        {pendingApp && (
                          <span className="text-xs bg-white/30 px-2 py-1 rounded-xl ml-2">
                            {new Date(pendingApp.created_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleClubJoin(club.club_id)}
                        disabled={submitting}
                        className="w-full p-6 bg-gradient-to-r from-slate-100 via-indigo-50 to-purple-50 text-slate-900 rounded-3xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 border-2 border-slate-200/50 hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:from-indigo-500 hover:to-purple-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 group/button disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <>
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Users className="w-6 h-6 group-hover/button:-translate-y-0.5 transition-transform" />
                            Apply to Join
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  </div>
);
};

export default StudentDashboard;


