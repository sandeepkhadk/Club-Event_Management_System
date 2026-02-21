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
  const [selectedClub, setSelectedClub] = useState(null);
  const { logout, token } = useAuthContext();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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
  const handleRemoveMember = async (userId) => {
  if (!window.confirm("Are you sure you want to remove this member?")) return;

  try {
    const res = await fetch(`${apiUrl}users/${userId}/remove/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      // ✅ Remove from state immediately
      setMembers((prev) => prev.filter((m) => m.user_id !== userId));
      alert("Member removed successfully");
    } else {
      alert("Failed to remove member");
    }
  } catch (err) {
    console.error(err);
    alert("Network error");
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

//   return (

//     // this to the adim-dash return firstdiv

//    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-amber-50 to-purple-50 text-slate-900 antialiased">

//       {selectedClub && (
//   <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl flex items-center justify-center z-50 px-4 sm:px-6 lg:px-8">
    
//     {/* Modal Container */}
//     <div className="relative bg-white/95 backdrop-blur-3xl 
//       w-full 
//       max-w-md sm:max-w-xl lg:max-w-3xl 
//       max-h-[90vh] 
//       overflow-y-auto 
//       rounded-2xl sm:rounded-3xl 
//       p-6 sm:p-8 lg:p-12 
//       shadow-2xl transition-all duration-300">

//       {/* Close Button */}
//       <button
//         onClick={() => setSelectedClub(null)}
//         className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition cursor-pointer text-lg sm:text-xl"
//       >
//         ✕
//       </button>

//       {/* Club Title */}
//       <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-4">
//         {selectedClub.name}
//       </h2>

//       {/* Description */}
//       <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 leading-relaxed">
//         {selectedClub.description}
//       </p>

//       {/* Info Section (Example Grid Layout) */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//         <div className="bg-slate-100 p-4 rounded-xl">
//           <h4 className="font-semibold text-sm sm:text-base">Category</h4>
//           <p className="text-gray-600 text-sm sm:text-base">
//             {selectedClub.category}
//           </p>
//         </div>

//         <div className="bg-slate-100 p-4 rounded-xl">
//           <h4 className="font-semibold text-sm sm:text-base">Members</h4>
//           <p className="text-gray-600 text-sm sm:text-base">
//             {selectedClub.membersCount}
//           </p>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex flex-col sm:flex-row gap-4 mt-6">

//         <button
//           onClick={() => handleJoin(selectedClub.id)}
//           className="bg-indigo-600 hover:bg-indigo-700 
//             text-white 
//             px-6 py-2 
//             rounded-xl 
//             transition 
//             cursor-pointer 
//             w-full sm:w-auto"
//         >
//           Join Club
//         </button>

//         <button
//           onClick={() => setSelectedClub(null)}
//           className="bg-gray-200 hover:bg-gray-300 
//             px-6 py-2 
//             rounded-xl 
//             transition 
//             cursor-pointer 
//             w-full sm:w-auto"
//         >
//           Cancel
//         </button>

//       </div>
//     </div>
//   </div>
// )}
//       {/*This to  Main Content */}
//       <main className="ml-64 flex-1 h-screen overflow-y-auto 
//       p-6 lg:p-8 bg-white/50 backdrop-blur-sm">

//   <div className="max-w-7xl mx-auto space-y-8">

//     {/* Member Management */}
//     {activeTab === 'members' && club_role === 'admin' && (
//       <div className="px-4 lg:px-0">
//         <MemberManagement
//           members={members}
//           setMembers={setMembers}
//           token={token}
//           fetchMembers={fetchMembers}
//         />
//       </div>
//     )}

//     {/* Enrolled Events */}
//     {activeTab === 'enrolled-events' && (
//       <div className="px-4 lg:px-0">
//         {enrolledEvents.length > 0 ? (
//           <EventList
//             events={enrolledEvents}
//             onJoin={handleJoinEvent}
//             onLeave={handleLeaveEvent}
//             currentUserId={decoded.user_id}
//             currentUserRole={club_role}
//             onDelete={club_role === 'admin' ? handleDeleteEvent : null}
//           />
//         ) : (
//           <div className="p-12 bg-indigo-50/50 text-center rounded-3xl shadow-xl max-w-4xl mx-auto">
//             <Calendar className="mx-auto w-16 h-16 text-indigo-400 mb-4" />
//             <h3 className="text-xl font-bold text-slate-700">No Enrolled Events</h3>
//             <p className="text-slate-500 mt-2">Join events to see them listed here.</p>
//           </div>
//         )}
//       </div>
//     )}

//     {/* Create Event */}
//     {activeTab === 'events' && (
//       <div className="px-4 lg:px-0 max-w-4xl mx-auto">
//         <EventCreationForm
//           onEventCreated={(event) => setEvents([...events, event])}
//           approvedHandlers={members.filter(m => m.status === 'Approved')}
//         />
//       </div>
//     )}

//     {/* Club Members */}
//     {activeTab === 'club-members' && (
//       <div className="px-4 lg:px-0">
//         <ClubMembersList clubId={clubId} members={members} handleRemoveMember={handleRemoveMember}/>
//       </div>
//     )}

//     {/* Manage Events */}
//     {activeTab === 'manage-events' && (
//       <div className="px-4 lg:px-0">
//         <EventList
//           events={events}
//           onEdit={openEditModal}
//           onJoin={handleJoinEvent}
//           onDelete={handleDeleteEvent}
//           onLeave={handleLeaveEvent}
//           currentUserId={decoded.user_id}
//           currentUserRole={club_role}
//         />
//       </div>
//     )}

//   </div>
// </main>


//       {/* Edit Event Modal */}
//       {isEditModalOpen && (
//         <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
//           <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
//             <EditEventModal
//               event={selectedEvent}
//               onClose={() => setIsEditModalOpen(false)}
//               onSave={(updated) => {
//                 setEvents(events.map(e => e.id === updated.id ? updated : e));
//                 setIsEditModalOpen(false);
//               }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Sidebar Button Component
// const SidebarButton = ({ active, icon, title, subtitle, onClick }) => (
//   <button
//     onClick={onClick}
//     className={`group flex items-center w-full p-4 rounded-xl transition-all duration-300 hover:shadow-lg ${
//       active
//         ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xl shadow-emerald-500/25'
//         : 'text-slate-300 hover:text-white hover:bg-slate-800/70 hover:translate-x-1 border border-slate-800/30'
//     }`}
//   >
//     <div className={`p-2.5 rounded-lg mr-3 transition-all ${
//       active ? 'bg-white/30 shadow-md' : 'bg-slate-800/50 group-hover:bg-white/20'
//     }`}>
//       {icon}
//     </div>
//     <div className="flex-1 text-left">
//       <span className="font-bold block leading-tight">{title}</span>
//       <span className="text-xs opacity-75 font-mono uppercase tracking-wider">{subtitle}</span>
//     </div>
//   </button>
// );
return (
  <div className="flex h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-amber-50 to-purple-50 text-slate-900 antialiased">
     {/* --- MOBILE SIDEBAR TOGGLE BUTTON --- */}
      <div className="lg:hidden flex justify-end p-4">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="text-slate-900 hover:text-indigo-600"
        >
          <Menu size={28} />
        </button>
      </div>
    {/* --------------------------- */}
    {/* Desktop Sidebar (visible lg+) */}
    {/* --------------------------- */}
    <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900 text-slate-200 shadow-2xl">
    <UserInfo />

    <nav className="flex-1 p-4 space-y-2">
      <button onClick={() => setActiveTab("members")} className="w-full text-left p-3 rounded-lg hover:bg-slate-800 transition">
        Members
      </button>
      <button onClick={() => setActiveTab("events")} className="w-full text-left p-3 rounded-lg hover:bg-slate-800 transition">
        Create Event
      </button>
      <button onClick={() => setActiveTab("club-members")} className="w-full text-left p-3 rounded-lg hover:bg-slate-800 transition">
        Club Members
      </button>
      <button onClick={() => setActiveTab("manage-events")} className="w-full text-left p-3 rounded-lg hover:bg-slate-800 transition">
        Manage Events
      </button>
      <button onClick={() => setActiveTab("enrolled-events")} className="w-full text-left p-3 rounded-lg hover:bg-slate-800 transition">
        Enrolled Events
      </button>
    </nav>

    <div className="p-4 border-t border-slate-800">
      <button onClick={handleLogout} className="w-full text-left p-3 rounded-lg hover:bg-red-600 transition">
        Logout
      </button>
    </div>
  </aside>

    {/* --------------------------- */}
    {/* Mobile Sidebar Overlay */}
    {/* --------------------------- */}
    {/* Dark overlay */}
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
        isMobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setIsMobileSidebarOpen(false)}
    />

    {/* Drawer */}
    <div
      className={`fixed top-0 right-0 h-full w-64 bg-slate-900 shadow-2xl z-[1000] transform transition-transform duration-300 lg:hidden ${
        isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex justify-end p-4">
        <button onClick={() => setIsMobileSidebarOpen(false)} className="text-white">
          <X size={28} />
        </button>
      </div>

      <UserInfo />

      <nav className="mt-4 flex flex-col gap-2 px-4">
        <button onClick={() => { setActiveTab("members"); setIsMobileSidebarOpen(false); }} className="w-full text-left p-3 rounded-lg hover:bg-slate-800 transition">
          Members
        </button>
        <button onClick={() => { setActiveTab("events"); setIsMobileSidebarOpen(false); }} className="w-full text-left p-3 rounded-lg hover:bg-slate-800 transition">
          Create Event
        </button>
        <button onClick={() => { setActiveTab("club-members"); setIsMobileSidebarOpen(false); }} className="w-full text-left p-3 rounded-lg hover:bg-slate-800 transition">
          Club Members
        </button>
        <button onClick={() => { setActiveTab("manage-events"); setIsMobileSidebarOpen(false); }} className="w-full text-left p-3 rounded-lg hover:bg-slate-800 transition">
          Manage Events
        </button>
        <button onClick={() => { setActiveTab("enrolled-events"); setIsMobileSidebarOpen(false); }} className="w-full text-left p-3 rounded-lg hover:bg-slate-800 transition">
          Enrolled Events
        </button>
      </nav>

      <div className="mt-auto p-4 border-t border-slate-800">
        <button onClick={handleLogout} className="w-full text-left p-3 rounded-lg hover:bg-red-600 transition">
          Logout
        </button>
      </div>
    </div>

    {/* --------------------------- */}
    {/* Main Content */}
    {/* --------------------------- */}
    <main className="flex-1 h-screen overflow-y-auto p-6 lg:p-8 bg-white/50 backdrop-blur-sm">

      {/* Mobile Hamburger */}
      <div className="lg:hidden flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Club Admin</h1>
        <button onClick={() => setIsMobileSidebarOpen(true)} className="p-2 bg-slate-800 text-white rounded-lg">☰</button>
      </div>

      {/* Tabs Content */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Member Management */}
        {activeTab === 'members' && club_role === 'admin' && (
          <MemberManagement
            members={members}
            setMembers={setMembers}
            token={token}
            fetchMembers={fetchMembers}
          />
        )}

        {/* Enrolled Events */}
        {activeTab === 'enrolled-events' && (
          <div>
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
          <EventCreationForm
            onEventCreated={(event) => setEvents([...events, event])}
            approvedHandlers={members.filter(m => m.status === 'Approved')}
          />
        )}

        {/* Club Members */}
        {activeTab === 'club-members' && (
          <ClubMembersList
            clubId={clubId}
            members={members}
            handleRemoveMember={handleRemoveMember}
            currentUser={userInfo}
          />
        )}

        {/* Manage Events */}
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
      </div>
    </main>

    {/* --------------------------- */}
    {/* Selected Club Modal */}
    {/* --------------------------- */}
    {selectedClub && (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl flex items-center justify-center z-50 px-4 sm:px-6 lg:px-8">
        <div className="relative bg-white/95 backdrop-blur-3xl w-full max-w-md sm:max-w-xl lg:max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl transition-all duration-300">
          <button onClick={() => setSelectedClub(null)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition cursor-pointer text-lg sm:text-xl">✕</button>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-4">{selectedClub.name}</h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 leading-relaxed">{selectedClub.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-100 p-4 rounded-xl">
              <h4 className="font-semibold text-sm sm:text-base">Category</h4>
              <p className="text-gray-600 text-sm sm:text-base">{selectedClub.category}</p>
            </div>
            <div className="bg-slate-100 p-4 rounded-xl">
              <h4 className="font-semibold text-sm sm:text-base">Members</h4>
              <p className="text-gray-600 text-sm sm:text-base">{selectedClub.membersCount}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button onClick={() => handleJoin(selectedClub.id)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl transition cursor-pointer w-full sm:w-auto">Join Club</button>
            <button onClick={() => setSelectedClub(null)} className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-xl transition cursor-pointer w-full sm:w-auto">Cancel</button>
          </div>
        </div>
      </div>
    )}

    {/* --------------------------- */}
    {/* Edit Event Modal */}
    {/* --------------------------- */}
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
}
export default AdminDashboard;
