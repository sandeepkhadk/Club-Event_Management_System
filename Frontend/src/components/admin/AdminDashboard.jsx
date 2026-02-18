import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../context/provider/AuthContext";
import { useUserRole } from '../../context/hooks/useUserRole';

import { Users, Calendar, PlusCircle, LogOut } from 'lucide-react';
import MemberManagement from './MemberManagement';
import EventCreationForm from './EventCreation';
import EventList from './EventList';
import EditEventModal from './EditEventModal';
import UserInfo from './UserInfo';
import ClubMembersList from './ClubMembersList';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('members');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const decoded=useUserRole()
  const clubId=decoded.club_id
  
  const club_role=decoded.club_role
  console.log(decoded)
  const { logout, token } = useAuthContext();
  console.log(token)
  const navigate = useNavigate();
 

  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => { fetchMembers(); }, []);
  
  const fetchMembers = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/clubs/${clubId}/members/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      console.log(data)
      setMembers(data.members || []);
    } catch (err) { console.log("Error fetching members", err); }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/events/visibility/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      console.log(data.events)
      setEvents(data.events || []);
    } catch (err) { console.log("Error fetching events:", err); }
  };
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

    // ✅ Update local state to reflect join
    setEvents(prevEvents =>
      prevEvents.map(e =>
        e.event_id === event.id
          ? { ...e, joined_users: [...(e.joined_users || []), decoded.user_id] }
          : e
      )
    );

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

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

    
    setEvents(prevEvents =>
      prevEvents.map(e =>
        e.event_id === event.id
          ? { ...e, joined_users: (e.joined_users || []).filter(uid => uid !== decoded.user_id) }
          : e
      )
    );

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};



const handleDeleteEvent = async (event) => {
  try {
    if (!token) throw new Error("You must be logged in to delete an event.");

    const res = await fetch(`http://127.0.0.1:8000/events/${event.id}/delete/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to delete event");

    
  setEvents((prevEvents) => prevEvents.filter((e) => e.event_id!== event.id));
  console.log("hello")

  } catch (err) {
    console.error(err);
    
  }
};



  const openEditModal = (event) => { setSelectedEvent(event); setIsEditModalOpen(true); };
  const handleLogout = () => { logout(); navigate("/"); };

  return (
  <div className="flex h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 text-slate-900 antialiased">
    {/* 🔥 Enhanced Sidebar */}
    <aside className="w-64 bg-gradient-to-b from-slate-900/95 to-slate-900 backdrop-blur-xl border-r border-slate-800/50 shadow-2xl shrink-0">
      <div className="p-6 text-center border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm space-y-4">
        {/* Title */}
        <h1 className="text-2xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent tracking-tight">
          {/* UserInfo */}
          <UserInfo />
        </h1>
        
        
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        {
          club_role ==='admin' &&
        <>
        <button 
          onClick={() => setActiveTab('members')} 
          className={`group flex items-center w-full p-4 rounded-xl transition-all duration-300 hover:shadow-lg ${
            activeTab === 'members' 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xl shadow-emerald-500/25 scale-105' 
              : 'text-slate-300 hover:text-white hover:bg-slate-800/70 hover:translate-x-1 hover:scale-[1.02] border border-slate-800/30'
          }`}
        >
          <div className={`p-2.5 rounded-lg mr-3 transition-all ${
            activeTab === 'members' 
              ? 'bg-white/30 shadow-md' 
              : 'bg-slate-800/50 group-hover:bg-white/20'
          }`}>
            <Users className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <span className="font-bold block leading-tight">Member Requests</span>
            <span className="text-xs opacity-75 font-mono uppercase tracking-wider">Pending Approvals</span>
          </div>
        </button>
        

        <button 
          onClick={() => setActiveTab('events')} 
          className={`group flex items-center w-full p-4 rounded-xl transition-all duration-300 hover:shadow-lg ${
            activeTab === 'events' 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xl shadow-emerald-500/25 scale-105' 
              : 'text-slate-300 hover:text-white hover:bg-slate-800/70 hover:translate-x-1 hover:scale-[1.02] border border-slate-800/30'
          }`}
        >
          <div className={`p-2.5 rounded-lg mr-3 transition-all ${
            activeTab === 'events' 
              ? 'bg-white/30 shadow-md' 
              : 'bg-slate-800/50 group-hover:bg-white/20'
          }`}>
            <PlusCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <span className="font-bold block leading-tight">Create Event</span>
            <span className="text-xs opacity-75 font-mono uppercase tracking-wider">New Events</span>
          </div>
        </button>
        </>
}
        <button 
          onClick={() => { setActiveTab('manage-events'); fetchEvents(); }} 
          className={`group flex items-center w-full p-4 rounded-xl transition-all duration-300 hover:shadow-lg ${
            activeTab === 'manage-events' 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xl shadow-emerald-500/25 scale-105' 
              : 'text-slate-300 hover:text-white hover:bg-slate-800/70 hover:translate-x-1 hover:scale-[1.02] border border-slate-800/30'
          }`}
        >
          <div className={`p-2.5 rounded-lg mr-3 transition-all ${
            activeTab === 'manage-events' 
              ? 'bg-white/30 shadow-md' 
              : 'bg-slate-800/50 group-hover:bg-white/20'
          }`}>
            <Calendar className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <span className="font-bold block leading-tight">Event Management</span>
            <span className="text-xs opacity-75 font-mono uppercase tracking-wider">All Events</span>
          </div>
        </button>
        {/* Member's List */}
            <button 
              onClick={() => setActiveTab('club-members')} 
              className={`group flex items-center w-full p-4 rounded-xl transition-all duration-300 hover:shadow-lg ${
                activeTab === 'club-members' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xl shadow-emerald-500/25 scale-105' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70 hover:translate-x-1 hover:scale-[1.02] border border-slate-800/30'
              }`}
            >
              <div className={`p-2.5 rounded-lg mr-3 transition-all ${
                activeTab === 'club-members' ? 'bg-white/30 shadow-md' : 'bg-slate-800/50 group-hover:bg-white/20'
              }`}>
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <span className="font-bold block leading-tight">Club Members</span>
                <span className="text-xs opacity-75 font-mono uppercase tracking-wider">View All</span>
              </div>
            </button>


      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
        <button 
          onClick={handleLogout} 
          className="group flex items-center w-full p-4 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-400/50 transition-all duration-300 shadow-lg hover:shadow-rose-500/25 hover:translate-x-1 hover:scale-[1.02] backdrop-blur-sm"
        >
          <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold tracking-wide">Sign Out</span>
        </button>
      </div>
    </aside>

    {/* Main Content */}
    <main className="flex-1 overflow-y-auto p-8 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Content */}
        {activeTab === 'members' &&  club_role=="admin"  &&(
          <MemberManagement 
            members={members} 
            setMembers={setMembers} 
            token={token} 
            fetchMembers={fetchMembers} 
          />
        )}
        
        {activeTab === 'events' && (
          <div className="max-w-4xl mx-auto">
            <EventCreationForm 
              onEventCreated={(event) => setEvents([...events, event])} 
              approvedHandlers={members.filter(m => m.status === 'Approved')} 
            />
          </div>
        )}
        {activeTab === 'club-members' && (
          <ClubMembersList clubId={clubId}  />
        )}

        {activeTab === 'manage-events' && (
          <EventList 
            events={events} 
            onEdit={openEditModal} 
            onJoin={handleJoinEvent} 
            onDelete={handleDeleteEvent} 
            onLeave={handleLeaveEvent} 
            currentUserId={decoded.user_id} 
            currentUserRole={club_role} 
          />
        )}

        {/* Edit Modal Overlay */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
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
    </main>
  </div>
);
};

export default AdminDashboard;