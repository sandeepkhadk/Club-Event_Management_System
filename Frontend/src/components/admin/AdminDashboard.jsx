import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/provider/AuthContext";
import { useUserRole } from '../../context/hooks/useUserRole';
import {
  Calendar, Menu, X, Users, PlusCircle, CalendarCheck,
  Settings, LogOut, ClipboardList, AlertTriangle
} from 'lucide-react';
import MemberManagement from './MemberManagement';
import EventCreationForm from './EventCreation';
import EventList from './EventList';
import EditEventModal from './EditEventModal';
import UserInfo from './UserInfo';
import ClubMembersList from './ClubMembersList';
import EventHandlerPanel from './EventHandlerPanel';
import apiUrl from '../../api';

// club_role values: 'admin' | 'event_handler' | 'member'

const NAV_ITEMS = [
  {
    key: 'members',
    label: 'Member Requests',
    icon: <Users size={18} />,
    roles: ['admin'],
  },
  {
    key: 'events',
    label: 'Create Event',
    icon: <PlusCircle size={18} />,
    roles: ['admin'],
  },
  {
    key: 'club-members',
    label: 'Club Members',
    icon: <Users size={18} />,
    roles: ['admin', 'event_handler', 'member'],
  },
  {
    key: 'manage-events',
    label: 'Manage Events',
    icon: <Settings size={18} />,
    roles: ['admin'],
  },
  {
    key: 'handler-events',
    label: 'My Events',
    icon: <ClipboardList size={18} />,
    roles: ['event_handler'],
  },
  {
    key: 'enrolled-events',
    label: 'Enrolled Events',
    icon: <CalendarCheck size={18} />,
    roles: ['admin', 'event_handler', 'member'],
  },
];

const SidebarContent = ({ activeTab, setActiveTab, club_role, handleLogout, closeMobile }) => {
  const changeTab = (key) => {
    setActiveTab(key);
    closeMobile?.();
  };

  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(club_role));

  return (
    <div className="flex flex-col h-full">
      {/* User Info */}
      <div className="px-4 pt-6 pb-4 border-b border-slate-700/60">
        <UserInfo />
      </div>

      {/* Role badge */}
      <div className="px-4 pt-3 pb-1">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border
          ${club_role === 'admin'
            ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'
            : club_role === 'event_handler'
            ? 'bg-[#39D353]/10 text-[#39D353] border-[#39D353]/20'
            : 'bg-slate-700/50 text-slate-400 border-slate-600/30'
          }`}>
          {club_role === 'admin'         && '👑 '}
          {club_role === 'event_handler' && '🎫 '}
          {club_role === 'member'        && '👤 '}
          {club_role?.replace('_', ' ')}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 mt-2 space-y-1 overflow-y-auto">
        {visibleItems.map(({ key, label, icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => changeTab(key)}
              className={`
                group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
                transition-all duration-200
                ${isActive
                  ? 'bg-[#39D353] text-slate-900 shadow-lg shadow-[#39D353]/40'
                  : 'text-slate-400 hover:bg-[#39D353]/10 hover:text-[#39D353]'
                }
              `}
            >
              <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-[#39D353]'}`}>
                {icon}
              </span>
              <span className="truncate">{label}</span>
              {isActive && <span className="ml-auto w-2 h-2 rounded-full bg-slate-900/40 flex-shrink-0" />}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6 pt-3 border-t border-slate-700/60">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
            text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const decoded = useUserRole();
  const clubId       = decoded.club_id;
  const club_role    = decoded.club_role;     // 'admin' | 'event_handler' | 'member'
  const currentUserId = decoded.user_id;

  const { logout, token } = useAuthContext();
  const navigate = useNavigate();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);

  const defaultTab =
    club_role === 'admin'         ? 'members' :
    club_role === 'event_handler' ? 'handler-events' :
    'enrolled-events';
  const [activeTab, setActiveTab] = useState(defaultTab);

  const [members, setMembers] = useState([]);
  const [events,  setEvents]  = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent,   setSelectedEvent]   = useState(null);

  useEffect(() => { fetchMembers(); fetchEvents(); }, []);

  const fetchMembers = async () => {
    try {
      const res  = await fetch(`${apiUrl}clubs/${clubId}/members/`, {
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await res.json();
      setMembers(data.members || []);
    } catch (err) { console.log("Error fetching members", err); }
  };

  const fetchEvents = async () => {
    try {
      const res  = await fetch(`${apiUrl}events/visibility/`, {
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) { console.log("Error fetching events:", err); }
  };

  const enrolledEvents = events.filter(e => (e.joined_users || []).includes(currentUserId));

  // Events where the current user is the assigned handler
  const handlerEvents = events.filter(
    e => e.handler_id === currentUserId || e.event_handler === currentUserId
  );

  const handleJoinEvent = async (event) => {
    try {
      if (!token) throw new Error("You must be logged in to join an event.");
      const res = await fetch(`${apiUrl}events/join/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ event_id: event.id }),
      });
      if (!res.ok) throw new Error("Failed to join event");
      setEvents(prev => prev.map(e =>
        e.id === event.id ? { ...e, joined_users: [...(e.joined_users || []), currentUserId] } : e
      ));
    } catch (err) { alert(err.message); }
  };

  const handleLeaveEvent = async (event) => {
    try {
      if (!token) throw new Error("You must be logged in to leave an event.");
      const res = await fetch(`${apiUrl}events/leave/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ event_id: event.id }),
      });
      if (!res.ok) throw new Error("Failed to leave event");
      setEvents(prev => prev.map(e =>
        e.id === event.id
          ? { ...e, joined_users: (e.joined_users || []).filter(uid => uid !== currentUserId) }
          : e
      ));
    } catch (err) { alert(err.message); }
  };

  const handleDeleteEvent = async (event) => {
    if (club_role !== 'admin') {
      alert("Only admins can delete events.");
      return;
    }
    const createdBy = event.created_by ?? event.creator_id ?? event.created_by_id;
    if (createdBy && createdBy !== currentUserId) {
      alert("You can only delete events that you created.");
      return;
    }
    if (!window.confirm(`Delete "${event.title || event.name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${apiUrl}events/${event.id}/delete/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete event");
      setEvents(prev => prev.filter(e => e.id !== event.id && e.event_id !== event.id));
    } catch (err) { console.error(err); alert("Error deleting event."); }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      const res = await fetch(`${apiUrl}users/${userId}/remove/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (res.ok) {
        setMembers(prev => prev.filter(m => m.user_id !== userId));
        alert("Member removed successfully");
      } else { alert("Failed to remove member"); }
    } catch (err) { console.error(err); alert("Network error"); }
  };

  const handleApproveJoinRequest = async (eventId, userId) => {
    try {
      const res = await fetch(`${apiUrl}events/${eventId}/join-requests/${userId}/approve/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to approve request");
      setEvents(prev => prev.map(e =>
        e.id === eventId
          ? {
              ...e,
              join_requests: (e.join_requests || []).map(r =>
                r.user_id === userId ? { ...r, status: 'approved' } : r
              ),
              joined_users: [...(e.joined_users || []), userId],
            }
          : e
      ));
    } catch (err) { alert(err.message); }
  };

  const handleRejectJoinRequest = async (eventId, userId) => {
    try {
      const res = await fetch(`${apiUrl}events/${eventId}/join-requests/${userId}/reject/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to reject request");
      setEvents(prev => prev.map(e =>
        e.id === eventId
          ? {
              ...e,
              join_requests: (e.join_requests || []).map(r =>
                r.user_id === userId ? { ...r, status: 'rejected' } : r
              ),
            }
          : e
      ));
    } catch (err) { alert(err.message); }
  };

  const openEditModal  = (event) => { setSelectedEvent(event); setIsEditModalOpen(true); };
  const handleLogout   = () => { logout(); navigate("/"); };

  const sidebarSharedProps = { activeTab, setActiveTab, club_role, handleLogout };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-amber-50 to-purple-50 text-slate-900 antialiased">

      
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 shadow-2xl flex-shrink-0">
        <SidebarContent {...sidebarSharedProps} closeMobile={null} />
      </aside>

      
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden
          ${isMobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900 shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out lg:hidden
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <button
          onClick={() => setIsMobileSidebarOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-[#39D353] transition-colors z-10"
        >
          <X size={22} />
        </button>
        <SidebarContent {...sidebarSharedProps} closeMobile={() => setIsMobileSidebarOpen(false)} />
      </div>

      
      <main className="flex-1 h-screen overflow-y-auto bg-white/50 backdrop-blur-sm flex flex-col">

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-slate-900 shadow-md flex-shrink-0">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-300 hover:text-[#39D353] hover:bg-[#39D353]/10 transition-all"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <span className="text-white font-bold text-sm tracking-wide">ClubHub</span>
        </div>

        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {activeTab === 'members' && club_role === 'admin' && (
              <MemberManagement
                members={members}
                setMembers={setMembers}
                token={token}
                fetchMembers={fetchMembers}
              />
            )}
            {activeTab === 'events' && club_role === 'admin' && (
              <EventCreationForm
                onEventCreated={(event) => setEvents(prev => [...prev, event])}
                approvedHandlers={members.filter(m => m.status === 'Approved')}
              />
            )}
            {activeTab === 'club-members' && (
              <ClubMembersList
                clubId={clubId}
                members={members}
                handleRemoveMember={handleRemoveMember}
              />
            )}
            {activeTab === 'manage-events' && club_role === 'admin' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
                  <span>
                    All admins can <strong>edit</strong> events.
                    Only the admin who <strong>created</strong> an event can <strong>delete</strong> it.
                  </span>
                </div>
                <EventList
                  events={events}
                  onEdit={openEditModal}
                  onJoin={handleJoinEvent}
                  onDelete={handleDeleteEvent}
                  onLeave={handleLeaveEvent}
                  currentUserId={currentUserId}
                  currentUserRole={club_role}
                />
              </div>
            )}
            {activeTab === 'handler-events' && club_role === 'event_handler' && (
              <EventHandlerPanel
                handlerEvents={handlerEvents}
                onEdit={openEditModal}
                onApproveJoin={handleApproveJoinRequest}
                onRejectJoin={handleRejectJoinRequest}
                currentUserId={currentUserId}
              />
            )}
            {activeTab === 'enrolled-events' && (
              enrolledEvents.length > 0 ? (
                <EventList
                  events={enrolledEvents}
                  onJoin={handleJoinEvent}
                  onLeave={handleLeaveEvent}
                  currentUserId={currentUserId}
                  currentUserRole={club_role}
                  onDelete={null}
                />
              ) : (
                <div className="p-12 bg-white text-center rounded-2xl border-2 border-dashed border-slate-200 max-w-4xl mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-base font-bold text-slate-600 mb-1">No Enrolled Events</h3>
                  <p className="text-sm text-slate-400">Join events to see them listed here.</p>
                </div>
              )
            )}

          </div>
        </div>
      </main>

      
      {selectedClub && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl flex items-center justify-center z-50 px-4">
          <div className="relative bg-white/95 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 shadow-2xl">
            <button onClick={() => setSelectedClub(null)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition text-xl">✕</button>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">{selectedClub.name}</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">{selectedClub.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-100 p-4 rounded-xl">
                <h4 className="font-semibold text-sm">Category</h4>
                <p className="text-gray-600 text-sm">{selectedClub.category}</p>
              </div>
              <div className="bg-slate-100 p-4 rounded-xl">
                <h4 className="font-semibold text-sm">Members</h4>
                <p className="text-gray-600 text-sm">{selectedClub.membersCount}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleJoin(selectedClub.id)} className="bg-[#39D353] hover:bg-[#2bb545] text-slate-900 font-semibold px-6 py-2 rounded-xl transition flex-1">Join Club</button>
              <button onClick={() => setSelectedClub(null)} className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-xl transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <EditEventModal
              event={selectedEvent}
              onClose={() => setIsEditModalOpen(false)}
              onSave={(updated) => {
                setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
                setIsEditModalOpen(false);
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;