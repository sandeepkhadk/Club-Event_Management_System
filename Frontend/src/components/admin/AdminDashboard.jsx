import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/provider/AuthContext";
import { useUserRole } from '../../context/hooks/useUserRole';
import {
  Calendar, Menu, X, Users, PlusCircle, CalendarCheck,
  Settings, LogOut, ClipboardList, Megaphone, Search
} from 'lucide-react';
import MemberManagement from './MemberManagement';
import EventCreationForm from './EventCreation';
import EventList from './EventList';
import EditEventModal from './EditEventModal';
import UserInfo from './UserInfo';
import ClubMembersList from './ClubMembersList';
import EventHandlerPanel from './EventHandlerPanel';
import AnnouncementsPanel from './AnnouncementsPanel';
import apiUrl from '../../api';

const NAV_ITEMS = [
  { key: 'members',        label: 'Member Requests', icon: <Users size={18} />,        roles: ['admin'] },
  { key: 'events',         label: 'Create Event',    icon: <PlusCircle size={18} />,   roles: ['admin'] },
  { key: 'club-members',   label: 'Club Members',    icon: <Users size={18} />,        roles: ['admin', 'event_handler', 'member'] },
  { key: 'manage-events',  label: 'Manage Events',   icon: <Settings size={18} />,     roles: ['admin'] },
  { key: 'handler-events', label: 'My Events',       icon: <ClipboardList size={18} />,roles: ['event_handler'] },
  { key: 'browse-events',  label: 'Browse Events',   icon: <Search size={18} />,       roles: ['admin', 'event_handler', 'member'] },
  { key: 'enrolled-events',label: 'Enrolled Events', icon: <CalendarCheck size={18} />,roles: ['admin', 'event_handler', 'member'] },
  { key: 'announcements',  label: 'Announcements',   icon: <Megaphone size={18} />,    roles: ['admin', 'event_handler', 'member'] },
];

const SidebarContent = ({ activeTab, setActiveTab, effective_role, handleLogout, closeMobile }) => {
  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(effective_role));
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-6 pb-4 border-b border-slate-700/60"><UserInfo /></div>
      <div className="px-4 pt-3 pb-1">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border
          ${effective_role === 'admin' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'
          : effective_role === 'event_handler' ? 'bg-[#39D353]/10 text-[#39D353] border-[#39D353]/20'
          : 'bg-slate-700/50 text-slate-400 border-slate-600/30'}`}>
          {effective_role === 'admin' ? '👑 ' : effective_role === 'event_handler' ? '🎫 ' : '👤 '}
          {effective_role?.replace('_', ' ')}
        </span>
      </div>
      <nav className="flex-1 px-3 mt-2 space-y-1 overflow-y-auto">
        {visibleItems.map(({ key, label, icon }) => {
          const isActive = activeTab === key;
          return (
            <button key={key} onClick={() => { setActiveTab(key); closeMobile?.(); }}
              className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${isActive ? 'bg-[#39D353] text-slate-900 shadow-lg shadow-[#39D353]/40' : 'text-slate-400 hover:bg-[#39D353]/10 hover:text-[#39D353]'}`}>
              <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-[#39D353]'}`}>{icon}</span>
              <span className="truncate">{label}</span>
              {isActive && <span className="ml-auto w-2 h-2 rounded-full bg-slate-900/40 flex-shrink-0" />}
            </button>
          );
        })}
      </nav>
      <div className="px-3 pb-6 pt-3 border-t border-slate-700/60">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const decoded       = useUserRole();
  const clubId        = decoded.club_id;
  const club_role     = decoded.club_role;
  const currentUserId = decoded.user_id;
  const { logout, token } = useAuthContext();
  const navigate = useNavigate();

  const [effective_role,setEffectiveRole]= useState(club_role);
 const [activeTab, setActiveTab] = useState(
  club_role !== 'admin' ? 'browse-events' : 'members'
);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [members,             setMembers]             = useState([]);
  const [events,              setEvents]              = useState([]);
  const [announcements,       setAnnouncements]       = useState([]);
  const [isEditModalOpen,     setIsEditModalOpen]     = useState(false);
  const [selectedEvent,       setSelectedEvent]       = useState(null);
  const [editEvent,           setEditEvent]           = useState(null); // handler inline edit

  const fetchMembers = async () => {
    try {
      const res  = await fetch(`${apiUrl}clubs/${clubId}/members/`, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
      const data = await res.json();
      const membersList = data.members || [];
      setMembers(membersList);
      if (club_role !== 'admin') {
        const me = membersList.find(m => m.user_id === currentUserId);
        const dbRole = me?.role?.toLowerCase();
        if (dbRole === 'event_handler') { setEffectiveRole('event_handler'); setActiveTab('handler-events'); }
      }
    } catch (err) { console.log("Error fetching members", err); }
  };

  const fetchEvents = async () => {
    try {
      const res  = await fetch(`${apiUrl}events/visibility/`,
         { headers: { "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) { console.log("Error fetching events:", err); }
  };

  const fetchAnnouncements = async () => {
    try {
      const res  = await fetch(`${apiUrl}clubs/${clubId}/announcements/`, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setAnnouncements(data.announcements || []);
    } catch (err) { console.log("Error fetching announcements:", err); }
  };

  useEffect(() => { fetchMembers(); fetchEvents(); fetchAnnouncements(); }, []);

  const handleSetMembers = (updaterFn) => {
    setMembers(prev => {
      const next = typeof updaterFn === 'function' ? updaterFn(prev) : updaterFn;
      if (club_role !== 'admin') {
        const me = next.find(m => m.user_id === currentUserId);
        const dbRole = me?.role?.toLowerCase();
        if (dbRole === 'event_handler') { setEffectiveRole('event_handler'); setActiveTab('handler-events'); }
        else { setEffectiveRole('member'); }
      }
      return next;
    });
  };

  const handlePostAnnouncement = async (message) => {
    try {
      const res = await fetch(`${apiUrl}clubs/${clubId}/announcements/`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ message }) });
      if (!res.ok) throw new Error("Failed to post announcement");
      const data = await res.json();
      setAnnouncements(prev => [data.announcement || { id: Date.now(), message, created_at: new Date().toISOString() }, ...prev]);
    } catch (err) { alert(err.message); }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      const res = await fetch(`${apiUrl}clubs/${clubId}/announcements/${announcementId}/`, { method: "DELETE", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to delete announcement");
      setAnnouncements(prev => prev.filter(a => a.id !== announcementId));
    } catch (err) { alert(err.message); }
  };

  const enrolledEvents = events.filter(e => (e.joined_users || []).includes(currentUserId));
  const handlerEvents  = events.filter(e => String(e.handler_id) === String(currentUserId));

  const handleJoinEvent = async (event) => {
    try {
      const res = await fetch(`${apiUrl}events/join/`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ event_id: event.event_id }) });
      if (!res.ok) throw new Error("Failed to join event");
      setEvents(prev => prev.map(e => e.event_id === event.event_id ? { ...e, joined_users: [...(e.joined_users || []), currentUserId] } : e));
    } catch (err) { alert(err.message); }
  };

  const handleLeaveEvent = async (event) => {
    try {
      const res = await fetch(`${apiUrl}events/leave/`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ event_id: event.event_id }) });
      if (!res.ok) throw new Error("Failed to leave event");
      setEvents(prev => prev.map(e => e.event_id === event.event_id ? { ...e, joined_users: (e.joined_users || []).filter(id => id !== currentUserId) } : e));
    } catch (err) { alert(err.message); }
  };

  const handleDeleteEvent = async (event) => {
    if (!window.confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${apiUrl}events/${event.event_id}/delete/`, { method: "DELETE", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to delete event");
      setEvents(prev => prev.filter(e => e.event_id !== event.event_id));
    } catch (err) { alert("Error deleting event."); }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      const res = await fetch(`${apiUrl}users/${userId}/remove/`, { method: "DELETE", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });
      if (res.ok) { setMembers(prev => prev.filter(m => m.user_id !== userId)); }
      else { alert("Failed to remove member"); }
    } catch (err) { alert("Network error"); }
  };

  const handleApproveJoinRequest = async (eventId, userId) => {
    try {
      const res = await fetch(`${apiUrl}events/${eventId}/join-requests/${userId}/approve/`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to approve request");
      setEvents(prev => prev.map(e => e.event_id === eventId ? { ...e, join_requests: (e.join_requests || []).map(r => r.user_id === userId ? { ...r, status: 'approved' } : r), joined_users: [...(e.joined_users || []), userId] } : e));
    } catch (err) { alert(err.message); }
  };

  const handleRejectJoinRequest = async (eventId, userId) => {
    try {
      const res = await fetch(`${apiUrl}events/${eventId}/join-requests/${userId}/reject/`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to reject request");
      setEvents(prev => prev.map(e => e.event_id === eventId ? { ...e, join_requests: (e.join_requests || []).map(r => r.user_id === userId ? { ...r, status: 'rejected' } : r) } : e));
    } catch (err) { alert(err.message); }
  };

  // ── Handler edit: check handler_id === currentUserId ─────────────────────
  const handleEditClick = (event) => {
    if (String(event.handler_id) === String(currentUserId)) {
      // Handler editing their own event — show inline form
      setEditEvent(event);
      setActiveTab('handler-events');
      setTimeout(() => document.getElementById('handler-edit-form')?.scrollIntoView({ behavior: 'smooth' }), 150);
    } else {
      // Admin editing any event — show modal
      setSelectedEvent(event);
      setIsEditModalOpen(true);
    }
  };

  const openEditModal = (event) => { setSelectedEvent(event); setIsEditModalOpen(true); };
  const handleLogout  = () => { logout(); navigate("/"); };
  const sidebarProps  = { activeTab, setActiveTab, effective_role, handleLogout };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-amber-50 to-purple-50 text-slate-900 antialiased">
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 shadow-2xl flex-shrink-0">
        <SidebarContent {...sidebarProps} closeMobile={null} />
      </aside>
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${isMobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileSidebarOpen(false)} />
      <div className={`fixed top-0 left-0 h-full w-64 bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setIsMobileSidebarOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-[#39D353] transition-colors z-10"><X size={22} /></button>
        <SidebarContent {...sidebarProps} closeMobile={() => setIsMobileSidebarOpen(false)}  />
      </div>

      <main className="flex-1 h-screen overflow-y-auto bg-white/50 backdrop-blur-sm flex flex-col">
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-slate-900 shadow-md flex-shrink-0">
          <button onClick={() => setIsMobileSidebarOpen(true)} className="p-2 rounded-lg text-slate-300 hover:text-[#39D353] hover:bg-[#39D353]/10 transition-all"><Menu size={22} /></button>
          <span className="text-white font-bold text-sm tracking-wide">ClubHub</span>
        </div>

        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">

            {activeTab === 'members' && effective_role === 'admin' && (
              <MemberManagement members={members} setMembers={setMembers} token={token} fetchMembers={fetchMembers} />
            )}

            {activeTab === 'events' && effective_role === 'admin' && (
                  <EventCreationForm
                    onEventCreated={(data) => {
                      const event = data.event || data;
                      setEvents(prev => [...prev, event]);
                      handleSetMembers(prev => prev.map(m =>
                        String(m.user_id) === String(event.handler_id) && m.role !== 'admin'
                          ? { ...m, role: 'event_handler' } : m
                      ));
                      // ← REMOVE this line:
                      // openEditModal(event);
                    }}
                    approvedHandlers={members.filter(m =>
                      m.status?.toLowerCase() === 'approved' && m.role?.toLowerCase() !== 'admin'
                    )}
                  />
                )}

            {activeTab === 'club-members' && (
              <ClubMembersList clubId={clubId} members={members} setMembers={handleSetMembers} handleRemoveMember={handleRemoveMember} club_role={effective_role} />
            )}

            {activeTab === 'manage-events' && effective_role === 'admin' && (
              <EventList events={events} onEdit={openEditModal} onJoin={handleJoinEvent} onDelete={handleDeleteEvent} onLeave={handleLeaveEvent} currentUserId={currentUserId} currentUserRole={effective_role} />
            )}

            {/* ── Handler: My Events + inline edit form ── */}
            {activeTab === 'handler-events' && effective_role === 'event_handler' && (
              <>
                <EventHandlerPanel
                  handlerEvents={handlerEvents}
                  onEdit={(event) => {
                    setEditEvent(event);
                    setTimeout(() => document.getElementById('handler-edit-form')?.scrollIntoView({ behavior: 'smooth' }), 150);
                  }}
                  onApproveJoin={handleApproveJoinRequest}
                  onRejectJoin={handleRejectJoinRequest}
                  currentUserId={currentUserId}
                />

                {/* Inline edit form — shown when handler clicks Edit */}
                {editEvent && (
                  <div id="handler-edit-form" className="scroll-mt-8">
                    {/* Cancel bar */}
                    <div className="flex items-center justify-between mb-3 px-1">
                      <p className="text-sm font-bold text-slate-500">
                        Editing: <span className="text-slate-800">{editEvent.title}</span>
                      </p>
                      <button
                        onClick={() => setEditEvent(null)}
                        className="text-xs text-red-400 hover:text-red-600 font-bold flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-all"
                      >
                        <X size={13} /> Cancel Edit
                      </button>
                    </div>

                    <EventCreationForm
                      editEvent={editEvent}
                      isEditable={true}
                      token={token} 
                      onEventUpdated={(updated) => {
                        setEvents(prev => prev.map(e =>
                          e.event_id === updated.event_id ? { ...e, ...updated } : e
                        ));
                        setEditEvent(null);
                      }}
                    />
                  </div>
                )}
              </>
            )}

            {/* ── Browse Events ── */}
            {activeTab === 'browse-events' && (
              events.length > 0 ? (
                <EventList
                  events={events}
                  onJoin={handleJoinEvent}
                  onLeave={handleLeaveEvent}
                  onEdit={handleEditClick}
                  onDelete={effective_role === 'admin' ? handleDeleteEvent : null}
                  currentUserId={currentUserId}
                  currentUserRole={effective_role}
                />
              ) : (
                <div className="p-12 bg-white text-center rounded-2xl border-2 border-dashed border-slate-200 max-w-4xl mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center"><Calendar className="w-8 h-8 text-slate-300" /></div>
                  <h3 className="text-base font-bold text-slate-600 mb-1">No Events Yet</h3>
                  <p className="text-sm text-slate-400">Events will appear here once created.</p>
                </div>
              )
            )}

            {activeTab === 'enrolled-events' && (
              enrolledEvents.length > 0 ? (
                <EventList events={enrolledEvents} onJoin={handleJoinEvent} onLeave={handleLeaveEvent} currentUserId={currentUserId} currentUserRole={effective_role} onDelete={null} onEdit={null} />
              ) : (
                <div className="p-12 bg-white text-center rounded-2xl border-2 border-dashed border-slate-200 max-w-4xl mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center"><Calendar className="w-8 h-8 text-slate-300" /></div>
                  <h3 className="text-base font-bold text-slate-600 mb-1">No Enrolled Events</h3>
                  <p className="text-sm text-slate-400">Go to Browse Events to join events.</p>
                </div>
              )
            )}

            {activeTab === 'announcements' && (
              <AnnouncementsPanel announcements={announcements} isAdmin={effective_role === 'admin'} onPost={handlePostAnnouncement} onDelete={handleDeleteAnnouncement} currentUserId={currentUserId} />
            )}

          </div>
        </div>
      </main>

      {/* Edit Modal — admin only */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <EditEventModal
              event={selectedEvent}
              onClose={() => setIsEditModalOpen(false)}
              onSave={(updated) => {
                setEvents(prev => prev.map(e => e.event_id === updated.event_id ? updated : e));
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