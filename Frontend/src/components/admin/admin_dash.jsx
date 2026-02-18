// import React, { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
// import { useAuthContext } from "../../context/provider/AuthContext";
// import { useParams } from "react-router-dom";



// import {
//   Users,
//   Calendar,
//   PlusCircle,
//   Shield,
//   Edit,
//   Trash2,
//   X,
//   LogOut
// } from 'lucide-react';

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState('members');
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const { logout } = useAuthContext();
//   const {token}=useAuthContext()
//   const navigate = useNavigate();
//   const { clubId } = useParams();
//   console.log(clubId)

//   const [members, setMembers] = useState([]);
//   const approveMember = async (userId, role) => {
//   try {
//     const res = await fetch(`http://127.0.0.1:8000/api/members/${userId}/approve/`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `Bearer ${token}` : "",
//       },
//       body: JSON.stringify({ role }), // send role to backend
//     });

//     if (!res.ok) throw new Error("Failed to approve");

//     fetchMembers(); // refresh the list
//   } catch (err) {
//     console.error(err);
//   }
// };

// const rejectMember = async (userId) => {
//   try {
//     const res = await fetch(`http://127.0.0.1:8000/api/members/${userId}/reject/`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `Bearer ${token}` : "",
//       },
//     });

//     if (!res.ok) throw new Error("Failed to reject");

//     fetchMembers(); // refresh the list
//   } catch (err) {
//     console.error(err);
//   }
// };

// const assignRole = async (userId, role) => {
//   try {
//     const res = await fetch(`http://127.0.0.1:8000/api/members/${userId}/role/`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `Bearer ${token}` : "",
//       },
//       body: JSON.stringify({ role }),
//     });

//     if (!res.ok) throw new Error("Failed to assign role");
//   } catch (err) {
//     console.error(err);
//   }
// };

//   useEffect(() => {
//     fetchMembers();
//   }, []);

//   const fetchMembers = async () => {
//     try {
     

//       const res = await fetch(  `http://127.0.0.1:8000/clubs/${clubId}/members/`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//       });

//       const data = await res.json();
//       setMembers(data.members || []); // adjust if backend JSON different
//     } catch (err) {
//       console.log("Error fetching members", err);
//     }
//   };

//   const approveMember = async (id) => {
//     try {
//       const token = localStorage.getItem("token");

//       await fetch(`http://127.0.0.1:8000/api/members/${id}/approve/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//       });

//       fetchMembers();
//     } catch (err) {
//       console.log("Error approving member", err);
//     }
//   };

//   /* ---------------- Events ---------------- */
//   const [events, setEvents] = useState([
//     { id: 1, name: "Tech Workshop", handler: "Shyam", date: "2026-05-20", status: "Planned" }
//   ]);

//   const addEvent = async (newEvent) => {
    
//   try {
//     // const token = localStorage.getItem("token"); // or use from context
//     const res = await fetch(`http://127.0.0.1:8000//${clubId}/events/`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `Bearer ${token}` : "",
//       },
//       body: JSON.stringify(newEvent),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       console.log("Error creating event:", data);
//       return;
//     }

//     // Add the event returned from backend to state
//     setEvents((prev) => [...prev, data]);
//     setActiveTab("manage-events"); // switch tab to event management
//   } catch (err) {
//     console.log("Error adding event:", err);
//   }
// };

// const fetchEvents = async () => {
//   try {
//     // const token = localStorage.getItem("token");
//     const res = await fetch(`http://127.0.0.1:8000/clubs/${clubId}/events/`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `Bearer ${token}` : "",
//       },
//     });

//     const data = await res.json();
//     setEvents(data.events || []); // make sure backend returns { events: [...] }
//   } catch (err) {
//     console.log("Error fetching events:", err);
//   }
// };

//   const openEditModal = (event) => {
//     setSelectedEvent(event);
//     setIsEditModalOpen(true);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   return (
//     <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">

//       {/* Sidebar */}
//       <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
//         <div className="p-6 text-2xl font-bold border-b border-slate-800">
//           ClubAdmin
//         </div>

//         <nav className="flex-1 p-4 space-y-2">
//           <button
//             onClick={() => setActiveTab('members')}
//             className={`flex items-center w-full p-3 rounded-lg
//             ${activeTab === 'members' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
//           >
//             <Users className="mr-3 size-5" /> Member Requests
//           </button>

//           <button
//             onClick={() => setActiveTab('events')}
//             className={`flex items-center w-full p-3 rounded-lg
//             ${activeTab === 'events' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
//           >
//             <PlusCircle className="mr-3 size-5" /> Create Event
//           </button>

//        <button
//   onClick={() => {
//     setActiveTab('manage-events');
//     fetchEvents(); // fetch all events for the current club
//   }}
//   className={`flex items-center w-full p-3 rounded-lg
//     ${activeTab === 'manage-events' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
// >
//   <Calendar className="mr-3 size-5" /> Event Management
// </button>
//         </nav>

//         <div className="p-4 border-t border-slate-800">
//           <button
//             onClick={handleLogout}
//             className="flex items-center w-full p-3 rounded-lg text-red-400 hover:bg-slate-800"
//           >
//             <LogOut className="mr-3 size-5" /> Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main */}
//       <main className="flex-1 overflow-y-auto p-8">

//         {activeTab === 'members' &&
//           <MemberManagement members={members} onApprove={approveMember} />
//         }

//         {activeTab === 'events' &&
//           <EventCreation
//             onEventCreated={addEvent}
//             approvedHandlers={members.filter(m => m.status === 'Approved')}
//           />
//         }

//         {activeTab === 'manage-events' &&
//           <EventList events={events} onEdit={openEditModal} />
//         }

//         {isEditModalOpen && (
//           <EditEventModal
//             event={selectedEvent}
//             onClose={() => setIsEditModalOpen(false)}
//             onSave={(updated) => {
//               setEvents(events.map(e => e.id === updated.id ? updated : e));
//               setIsEditModalOpen(false);
//             }}
//           />
//         )}
//       </main>
//     </div>
//   );
// };

// /* -------- Member Management UI (UNCHANGED) -------- */
// /* -------- Member Management UI (Updated) -------- */
// const MemberManagement = ({ members, onApprove, onReject, onAssignRole }) => {
//   const [roleSelections, setRoleSelections] = useState({});

//   const handleRoleChange = (userId, role) => {
//     setRoleSelections({ ...roleSelections, [userId]: role });
//     if (onAssignRole) onAssignRole(userId, role); // optional callback to backend
//   };

//   return (
//     <section>
//       <h2 className="text-3xl font-extrabold mb-6">Member Requests</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {members.map((member) => (
//           <div
//             key={member.user_id + member.status}
//             className="bg-white rounded-xl shadow p-5 flex flex-col space-y-3"
//           >
//             <div className="flex items-center justify-between">
//               <h3 className="font-bold text-lg">{member.name}</h3>
//               <span className={`px-2 py-1 rounded text-sm ${member.status === "Approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
//                 {member.status}
//               </span>
//             </div>

//             <div className="flex items-center space-x-2">
//               <Shield className="size-4 text-blue-500" />
//               <span>{member.role || "No role assigned"}</span>
//             </div>

//             {member.status === "Pending" && (
//               <>
//                 {/* Role Selector */}
//                 <select
//                   value={roleSelections[member.user_id] || ""}
//                   onChange={(e) => handleRoleChange(member.user_id, e.target.value)}
//                   className="border rounded p-2 w-full"
//                 >
//                   <option value="">Select Role</option>
//                   <option value="member">Member</option>
//                   <option value="moderator">Moderator</option>
//                   <option value="admin">Admin</option>
//                 </select>

//                 {/* Approve / Reject Buttons */}
//                 <div className="flex justify-between space-x-2">
//                   <button
//                     onClick={() => onApprove(member.user_id, roleSelections[member.user_id])}
//                     className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//                     disabled={!roleSelections[member.user_id]} // must select a role before approving
//                   >
//                     Approve
//                   </button>
//                   <button
//                     onClick={() => onReject(member.user_id)}
//                     className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
//                   >
//                     Reject
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };


// /* -------- Event Creation (UNCHANGED) -------- */
// const EventCreation = ({ onEventCreated, approvedHandlers }) => {
//   const [formData, setFormData] = useState({
//     name: '', handler: '', date: '', status: 'Planned'
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onEventCreated(formData);
//   };

//   return (
//     <section className="max-w-xl">
//       <h2 className="text-3xl font-extrabold mb-6">Create Event</h2>
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
//         <input className="w-full border p-3 rounded"
//           placeholder="Event Name"
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//         />

//         <select className="w-full border p-3 rounded"
//           onChange={(e) => setFormData({ ...formData, handler: e.target.value })}
//         >
//           <option value="">Select Handler</option>
//           {approvedHandlers.map(h => (
//             <option key={h.id}>{h.name}</option>
//           ))}
//         </select>

//         <input type="date" className="w-full border p-3 rounded"
//           onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//         />

//         <button className="w-full bg-blue-600 text-white py-3 rounded">
//           Create Event
//         </button>
//       </form>
//     </section>
//   );
// };

// /* -------- Event List -------- */
// const EventList = ({ events, onEdit }) => (
//   <section>
//     <h2 className="text-3xl font-extrabold mb-6">Events</h2>
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       {events.map(event => (
//         <div key={event.id} className="bg-white p-5 rounded-xl shadow">
//           <h3 className="font-bold">{event.name}</h3>
//           <p>{event.handler}</p>
//           <p>{event.date}</p>
//           <button
//             onClick={() => onEdit(event)}
//             className="mt-3 bg-gray-200 px-4 py-2 rounded"
//           >
//             <Edit className="inline size-4 mr-1" /> Edit
//           </button>
//         </div>
//       ))}
//     </div>
//   </section>
// );

// /* -------- Edit Modal -------- */
// const EditEventModal = ({ event, onClose, onSave }) => {
//   const [editData, setEditData] = useState({ ...event });

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//       <div className="bg-white p-6 rounded-xl w-96">
//         <h3 className="font-bold mb-4">Edit Event</h3>

//         <input className="w-full border p-2 mb-3"
//           value={editData.name}
//           onChange={(e) => setEditData({ ...editData, name: e.target.value })}
//         />

//         <button onClick={() => onSave(editData)}
//           className="bg-blue-600 text-white px-4 py-2 rounded">
//           Save
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import ApprovedMembers from './approvedmembers';
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../context/provider/AuthContext";
import { useUserRole } from '../../context/hooks/useUserRole';

import { Users, Calendar, PlusCircle, LogOut } from 'lucide-react';
import MemberManagement from './MemberManagement';
import EventCreationForm from './EventCreation';
import EventList from './EventList';
import EditEventModal from './EditEventModal';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('members');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const decoded=useUserRole()
  const clubId=decoded.club_id
  const club_role=decoded.club_role

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
      const res = await fetch(`http://127.0.0.1:8000/clubs/${clubId}/events/`, {
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

// Leave an event
// const handleLeaveEvent = async (event) => {
//   try {
//     if (!token) throw new Error("You must be logged in to leave an event.");

//     const res = await fetch(`http://127.0.0.1:8000/events/${event.id}/leave/`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!res.ok) throw new Error("Failed to leave event");

//     // Optional: Remove the event from state if user is no longer participating
//     // Or you can fetchEvents() again if needed
//     alert(`You have left the event "${event.title}".`);
//   } catch (err) {
//     console.error(err);
//     alert(err.message);
//   }
// };



  const openEditModal = (event) => { setSelectedEvent(event); setIsEditModalOpen(true); };
  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 text-2xl font-bold border-b border-slate-800">ClubAdmin</div>
        <nav className="flex-1 p-4 space-y-2">
  
{club_role === "admin" && (
  <button
    onClick={() => setActiveTab('members')}
    className={`flex items-center w-full p-3 rounded-lg ${
      activeTab === 'members' ? 'bg-blue-600' : 'hover:bg-slate-800'
    }`}
  >
    <Users className="mr-3 size-5" /> Member Requests
  </button>
)}


{club_role === "admin" && (
  <button
    onClick={() => setActiveTab('events')}
    className={`flex items-center w-full p-3 rounded-lg ${
      activeTab === 'events' ? 'bg-blue-600' : 'hover:bg-slate-800'
    }`}
  >
    <PlusCircle className="mr-3 size-5" /> Create Event
  </button>
)}


{club_role !=="admin" && (
  <button
    onClick={() => { setActiveTab('members'); fetchMembers(); }} // fetchMembers is your function to load members
    className={`flex items-center w-full p-3 rounded-lg ${
      activeTab === 'members' ? 'bg-blue-600' : 'hover:bg-slate-800'
    }`}
  >
    <Users className="mr-3 size-5" /> Member Requests
  </button>
)}


  <button
    onClick={() => { setActiveTab('manage-events'); fetchEvents(); }}
    className={`flex items-center w-full p-3 rounded-lg ${
      activeTab === 'manage-events' ? 'bg-blue-600' : 'hover:bg-slate-800'
    }`}
  >
    <Calendar className="mr-3 size-5" /> Event Management
  </button>


        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center w-full p-3 rounded-lg text-red-400 hover:bg-slate-800">
            <LogOut className="mr-3 size-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === "members" &&  club_role !=="admin" &&(
  <ApprovedMembers clubId={decoded.club_id} token={token} />
)}
        {activeTab === 'members' && 
          <MemberManagement members={members} setMembers={setMembers} token={token} fetchMembers={fetchMembers} />
        }
        {activeTab === 'events' &&
          <EventCreationForm onEventCreated={(event) => setEvents([...events, event])} approvedHandlers={members.filter(m => m.status === 'Approved')} />
        }
        {activeTab === 'manage-events' &&
        <EventList events={events} onEdit={openEditModal} onJoin={handleJoinEvent} onDelete={handleDeleteEvent} onLeave={handleLeaveEvent} currentUserId={decoded.user_id} currentUserRole={club_role} />
        }

        {isEditModalOpen && 
          <EditEventModal event={selectedEvent} onClose={() => setIsEditModalOpen(false)} onSave={(updated) => {
            setEvents(events.map(e => e.id === updated.id ? updated : e));
            setIsEditModalOpen(false);
          }} 
        />}
      </main>
    </div>
  );
};

export default AdminDashboard;
