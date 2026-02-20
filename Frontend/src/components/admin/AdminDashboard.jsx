import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/provider/AuthContext";
import { useUserRole } from '../../context/hooks/useUserRole';

import { Users, Calendar, PlusCircle, LogOut } from 'lucide-react';
import MemberManagement from './MemberManagement';
import EventCreationForm from './EventCreation';
import EventList from './EventList';
import EditEventModal from './EditEventModal';
import UserInfo from './UserInfo';
import ClubMembersList from './ClubMembersList';
import apiUrl from '../../api';

const AdminDashboard = () => {
  const decoded = useUserRole();
  const clubId = decoded.club_id;
  const club_role = decoded.club_role;

  const { logout, token } = useAuthContext();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(
    club_role === 'member' ? 'enrolled-events' : 'members'
  );
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch Members
  useEffect(() => { fetchMembers();
    fetchEvents();
   }, []);
  

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${apiUrl}clubs/${clubId}/members/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      setMembers(data.members || []);
    } catch (err) { console.log("Error fetching members", err); }
  };

  // Fetch Events
  const fetchEvents = async () => {
    try {
      const res = await fetch(`${apiUrl}events/visibility/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) { console.log("Error fetching events:", err); }
  };

 const enrolledEvents = events.filter(
  e => (e.joined_users || []).includes(decoded?.user_id)
);

  const handleJoinEvent = async (event) => {
    try {
      if (!token) throw new Error("You must be logged in to join an event.");

    const res = await fetch(`${apiUrl}events/join/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event_id: event.id }),
      });

      if (!res.ok) throw new Error("Failed to join event");

      setEvents(prev => prev.map(e =>
        e.event_id === event.id ? { ...e, joined_users: [...(e.joined_users || []), decoded.user_id] } : e
      ));
    } catch (err) {
      alert(err.message);
    }
  };
  setMembers(prev => prev.filter(m => m.user_id !== requestId));
  setRoleSelections(prev => {
    const updated = { ...prev };
    delete updated[requestId];
    return updated;
  });

  try {
    await fetch(`${apiUrl}users/requests/approve/${requestId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ role }),
    });
  } catch (err) {
    console.error(err);
    // Optional: rollback in case of failure
    fetchMembers();
  }
};

  const handleLeaveEvent = async (event) => {
    try {
      if (!token) throw new Error("You must be logged in to leave an event.");

      const res = await fetch(`${apiUrl}events/leave/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event_id: event.id }),
      });

      if (!res.ok) throw new Error("Failed to leave event");

      setEvents(prev => prev.map(e =>
        e.event_id === event.id
          ? { ...e, joined_users: (e.joined_users || []).filter(uid => uid !== decoded.user_id) }
          : e
      ));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteEvent = async (event) => {
    try {
      if (!token) throw new Error("You must be logged in to delete an event.");

      const res = await fetch(`${apiUrl}events/${event.id}/delete/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete event");

      setEvents(prev => prev.filter(e => e.event_id !== event.id));
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (

    // this to the adim-dash return firstdiv

   <div className="flex min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-purple-50 text-slate-900 antialiased">

      {/* This to Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-slate-900/95 to-slate-900 backdrop-blur-xl border-r border-slate-800/50 
  shadow-2xl flex flex-col">

        <div className="p-6 flex-shrink-0 border-b border-slate-800/50">
          <UserInfo />
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {club_role === 'admin' && (
            <>
              <SidebarButton
                active={activeTab === 'members'}
                icon={<Users className="w-5 h-5" />}
                title="Member Requests"
                subtitle="Pending Approvals"
                onClick={() => setActiveTab('members')}
              />
              <SidebarButton
                active={activeTab === 'events'}
                icon={<PlusCircle className="w-5 h-5" />}
                title="Create Event"
                subtitle="New Events"
                onClick={() => setActiveTab('events')}
              />
            </>
          )}

          <SidebarButton
            active={activeTab === 'enrolled-events'}
            icon={<Calendar className="w-5 h-5" />}
            title="Enrolled Events"
            subtitle="Events You Joined"
            onClick={() => setActiveTab('enrolled-events')}
          />

          <SidebarButton
            active={activeTab === 'manage-events'}
            icon={<Calendar className="w-5 h-5" />}
            title="Event Management"
            subtitle="All Events"
            onClick={() => { setActiveTab('manage-events'); fetchEvents(); }}
          />

          <SidebarButton
            active={activeTab === 'club-members'}
            icon={<Users className="w-5 h-5" />}
            title="Club Members"
            subtitle="View All"
            onClick={() => setActiveTab('club-members')}
          />
        </nav>

        <div className="p-6 flex-shrink-0 border-t border-slate-800/50">
          <button 
            onClick={handleLogout}
            className="group flex items-center w-full p-4 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-400/50 transition-all duration-300 shadow-lg hover:shadow-rose-500/25"
          >
            <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold tracking-wide">Sign Out</span>
          </button>
        </div>
      </aside>

      {/*This to  Main Content */}
      <main className="ml-64 flex-1 h-screen overflow-y-auto 
  p-6 lg:p-8 bg-white/50 backdrop-blur-sm">

  <div className="max-w-7xl mx-auto space-y-8">

    {/* Member Management */}
    {activeTab === 'members' && club_role === 'admin' && (
      <div className="px-4 lg:px-0">
        <MemberManagement
          members={members}
          setMembers={setMembers}
          token={token}
          fetchMembers={fetchMembers}
        />
      </div>
    )}

    {/* Enrolled Events */}
    {activeTab === 'enrolled-events' && (
      <div className="px-4 lg:px-0">
        {enrolledEvents.length > 0 ? (
          <EventList
            events={enrolledEvents}
            onJoin={handleJoinEvent}
            onLeave={handleLeaveEvent}
            currentUserId={decoded.user_id}
            currentUserRole={club_role}
            onDelete={club_role === 'admin' ? handleDeleteEvent : null}
          />
        ) : (
          <div className="p-12 bg-indigo-50/50 text-center rounded-3xl shadow-xl max-w-4xl mx-auto">
            <Calendar className="mx-auto w-16 h-16 text-indigo-400 mb-4" />
            <h3 className="text-xl font-bold text-slate-700">No Enrolled Events</h3>
            <p className="text-slate-500 mt-2">Join events to see them listed here.</p>
          </div>
        )}
      </div>
    )}

    {/* Create Event */}
    {activeTab === 'events' && (
      <div className="px-4 lg:px-0 max-w-4xl mx-auto">
        <EventCreationForm
          onEventCreated={(event) => setEvents([...events, event])}
          approvedHandlers={members.filter(m => m.status === 'Approved')}
        />
      </div>
    )}

    {/* Club Members */}
    {activeTab === 'club-members' && (
      <div className="px-4 lg:px-0">
        <ClubMembersList clubId={clubId}  handleRemoveMember={handleRemoveMember}/>
      </div>
    )}

    {/* Manage Events */}
    {activeTab === 'manage-events' && (
      <div className="px-4 lg:px-0">
        <EventList
          events={events}
          onEdit={openEditModal}
          onJoin={handleJoinEvent}
          onDelete={handleDeleteEvent}
          onLeave={handleLeaveEvent}
          currentUserId={decoded.user_id}
          currentUserRole={club_role}
        />
      </div>
    )}

  </div>
</main>


      {/* Edit Event Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <EditEventModal
              event={selectedEvent}
              onClose={() => setIsEditModalOpen(false)}
              onSave={(updated) => {
                setEvents(events.map(e => e.id === updated.id ? updated : e));
                setIsEditModalOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Sidebar Button Component
const SidebarButton = ({ active, icon, title, subtitle, onClick }) => (
  <button
    onClick={onClick}
    className={`group flex items-center w-full p-4 rounded-xl transition-all duration-300 hover:shadow-lg ${
      active
        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xl shadow-emerald-500/25'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/70 hover:translate-x-1 border border-slate-800/30'
    }`}
  >
    <div className={`p-2.5 rounded-lg mr-3 transition-all ${
      active ? 'bg-white/30 shadow-md' : 'bg-slate-800/50 group-hover:bg-white/20'
    }`}>
      {icon}
    </div>
    <div className="flex-1 text-left">
      <span className="font-bold block leading-tight">{title}</span>
      <span className="text-xs opacity-75 font-mono uppercase tracking-wider">{subtitle}</span>
    </div>
  </button>
);

export default AdminDashboard;
