import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Users, Activity, Sparkles } from "lucide-react";
import { useAuthContext } from "../../context/provider/AuthContext";
import EventList from "../admin/EventList";
import { useUserRole } from "../../context/hooks/useUserRole";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const decoded = useUserRole();
  const user_id = decoded.user_id;
  const { token, logout } = useAuthContext();

  // --- State ---
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [myClubs, setMyClubs] = useState([]);
  const [clubEvents, setClubEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // --- Fetch dashboard data ---
  const fetchDashboardData = useCallback(async () => {
    if (!token || !user_id) return;
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

      // ✅ Safe approved clubs
      const approvedClubs = profileData.approved_clubs || [];
      setMyClubs(approvedClubs);

      // ✅ Normalize events
      const normalizedEvents = (eventData.events || []).map((e) => {
        const eventId = e.id || e.event_id;
        return {
          id: eventId,
          title: e.title,
          description: e.description,
          start_datetime: e.start_datetime,
          end_datetime: e.end_datetime,
          club_id: e.club_id || null,
          joined_users: e.joined_users || [],
          joined: (e.joined_users || []).includes(user_id),
          status: e.status || "Active",
          handler_id: e.handler_id || null,
          handler_name: e.handler_name || null,
          max_capacity: e.max_capacity || null,
          visibility: e.visibility || "global",
        };
      });

      setEvents(normalizedEvents);

      // Map club-specific events
      const clubEventsMap = {};
      approvedClubs.forEach((club) => {
        clubEventsMap[club.club_id] = normalizedEvents.filter(
          (e) => e.club_id === club.club_id
        );
      });
      setClubEvents(clubEventsMap);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [token, user_id]);

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
    if (!token) return alert("Not authenticated");
    setSubmitting(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/users/join-club/${club_id}/`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send request");
      alert(`Request sent successfully: ${data.message}`);
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // --- Join Event ---
  const handleJoinEvent = async (event) => {
    try {
      if (!token) throw new Error("You must be logged in to join an event.");

      const res = await fetch(`http://127.0.0.1:8000/events/join/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event_id: event.id }),
      });

      if (!res.ok) throw new Error("Failed to join event");

      // Update local state
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.id === event.id
            ? { ...e, joined_users: [...(e.joined_users || []), user_id], joined: true }
            : e
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // --- Leave Event ---
  const handleLeaveEvent = async (event) => {
    try {
      if (!token) throw new Error("You must be logged in to leave an event.");

      const res = await fetch(`http://127.0.0.1:8000/events/leave/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event_id: event.id }),
      });

      if (!res.ok) throw new Error("Failed to leave event");

      // Update local state
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.id === event.id
            ? {
                ...e,
                joined_users: (e.joined_users || []).filter((uid) => uid !== user_id),
                joined: false,
              }
            : e
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // --- Loading state ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="bg-indigo-600 p-4 rounded-2xl text-white animate-bounce mb-4">
          <Sparkles size={32} />
        </div>
        <h2 className="text-slate-400 font-black uppercase tracking-widest text-sm">
          Syncing Dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-32">
      {/* TOP NAV */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <Sparkles size={20} />
            </div>
            <h1 className="font-black text-xl tracking-tighter uppercase italic">
              Campus<span className="text-indigo-600">Core</span>
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-rose-600 font-bold text-xs uppercase tracking-widest"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-12 space-y-12">
        {/* APPLICATION TRACKER */}
        <section>
          <div className="flex items-center gap-2 mb-6 px-2">
            <Activity className="text-indigo-600" size={20} />
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">
              Application Tracker
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {myApplications.length ? (
              myApplications.map((app, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between"
                >
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">
                      {app.club_name}
                    </p>
                    <p className="text-sm font-bold text-slate-800">Membership</p>
                  </div>
                  {app.status === "Approved" ? (
                    <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl flex items-center gap-1">
                      <span className="text-[10px] font-black uppercase">Approved</span>
                    </div>
                  ) : (
                    <div className="bg-amber-50 text-amber-600 p-2 rounded-xl flex items-center gap-1">
                      <span className="text-[10px] font-black uppercase">Pending</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full py-6 px-6 bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                <p className="text-slate-400 text-sm font-medium italic">
                  No applications found. Start by joining a club below!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* LIVE EVENTS */}
        <section>
          <EventList
            events={events}
            onJoin={handleJoinEvent}
            onLeave={handleLeaveEvent}
            currentUserId={user_id}
            club_role={null} // students are never admins
            onDelete={null} // hide delete button
          />
        </section>

        {/* EXPLORE CLUBS */}
        <section>
          <div className="flex items-center gap-3 mb-8 px-2">
            <Users className="text-indigo-600" size={24} />
            <h2 className="text-2xl font-black text-slate-800">Explore Clubs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {clubs.map((club) => (
              <div
                key={club.club_id}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-indigo-200 hover:shadow-2xl transition-all group"
              >
                <h4 className="text-xl font-black mb-2 group-hover:text-indigo-600 transition-colors">
                  {club.name}
                </h4>
                <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed">
                  {club.description ||
                    "Join us to learn new skills and connect with peers."}
                </p>
                <button
                  onClick={() => handleClubJoin(club.club_id)}
                  disabled={submitting}
                  className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  ) : (
                    "Apply to Join"
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
