// import React, { useState } from 'react';
// import { Users, Calendar, PlusCircle, Shield, Edit, Trash2, X, Check } from 'lucide-react';

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState('members');
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);

//   // Mock Data for Members
//   const [members, setMembers] = useState([
//     { id: 1, name: "Ram", role: "Member", status: "Pending" },
//     { id: 2, name: "Shyam", role: "Handler", status: "Approved" },
//     { id: 3, name: "Sita", role: "Handler", status: "Approved" },
//   ]);

//   // Shared state to store events
//   const [events, setEvents] = useState([
//     { id: 1, name: "Tech Workshop", handler: "Shyam", date: "2026-05-20", status: "Planned" }
//   ]);

//   // Handlers
//   const addEvent = (newEvent) => {
//     setEvents([...events, { ...newEvent, id: Date.now() }]);
//     setActiveTab('manage-events');
//   };

//   const approveMember = (id) => {
//     setMembers(members.map(m => m.id === id ? { ...m, status: 'Approved' } : m));
//   };

//   const openEditModal = (event) => {
//     setSelectedEvent(event);
//     setIsEditModalOpen(true);
//   };

//   return (
//     <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
//       {/* Sidebar */}
//       <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
//         <div className="p-6 text-2xl font-bold border-b border-slate-800 tracking-tight">ClubAdmin</div>
//         <nav className="flex-1 p-4 space-y-2">
//           <button 
//             onClick={() => setActiveTab('members')}
//             className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'members' ? 'bg-blue-600 shadow-md' : 'hover:bg-slate-800'}`}
//           >
//             <Users className="mr-3 size-5" /> Member Requests
//           </button>
//           <button 
//             onClick={() => setActiveTab('events')}
//             className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'events' ? 'bg-blue-600 shadow-md' : 'hover:bg-slate-800'}`}
//           >
//             <PlusCircle className="mr-3 size-5" /> Create Event
//           </button>
//           <button 
//             onClick={() => setActiveTab('manage-events')}
//             className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'manage-events' ? 'bg-blue-600 shadow-md' : 'hover:bg-slate-800'}`}
//           >
//             <Calendar className="mr-3 size-5" /> Event Management
//           </button>
//         </nav>
//       </aside>

//       {/* Main Content Area */}
//       <main className="flex-1 overflow-y-auto p-8 relative">
//         {activeTab === 'members' && <MemberManagement members={members} onApprove={approveMember} />}
//         {activeTab === 'events' && <EventCreation onEventCreated={addEvent} approvedHandlers={members.filter(m => m.status === 'Approved')} />}
//         {activeTab === 'manage-events' && <EventList events={events} onEdit={openEditModal} />}

//         {/* Edit Modal Overlay */}
//         {isEditModalOpen && (
//           <EditEventModal 
//             event={selectedEvent} 
//             onClose={() => setIsEditModalOpen(false)} 
//             onSave={(updated) => {
//                 setEvents(events.map(e => e.id === updated.id ? updated : e));
//                 setIsEditModalOpen(false);
//             }}
//           />
//         )}
//       </main>
//     </div>
//   );
// };

// // --- Sub-Component: Member Management ---
// const MemberManagement = ({ members, onApprove }) => (
//   <section className="animate-in fade-in duration-500">
//     <h2 className="text-3xl font-extrabold mb-6">Member Approval</h2>
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//       <table className="w-full text-left border-collapse">
//         <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs font-bold">
//           <tr>
//             <th className="p-4">Name</th>
//             <th className="p-4">Role</th>
//             <th className="p-4">Status</th>
//             <th className="p-4 text-right">Action</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-100">
//           {members.map(m => (
//             <tr key={m.id} className="hover:bg-gray-50/50 transition">
//               <td className="p-4 font-medium">{m.name}</td>
//               <td className="p-4">
//                 <span className="flex items-center text-sm">
//                   <Shield className="size-4 mr-1.5 text-blue-500" /> {m.role}
//                 </span>
//               </td>
//               <td className="p-4">
//                 <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${m.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
//                   {m.status}
//                 </span>
//               </td>
//               <td className="p-4 text-right">
//                 {m.status === 'Pending' && (
//                   <button 
//                     onClick={() => onApprove(m.id)}
//                     className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition active:scale-95"
//                   >
//                     Approve
//                   </button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   </section>
// );

// // --- Sub-Component: Event Creation ---
// const EventCreation = ({ onEventCreated, approvedHandlers }) => {
//   const [formData, setFormData] = useState({ name: '', handler: '', date: '', status: 'Planned' });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.name || !formData.date) return alert("Please fill all fields");
//     onEventCreated(formData);
//   };

//   return (
//     <section className="max-w-2xl animate-in slide-in-from-bottom-4 duration-500">
//       <h2 className="text-3xl font-extrabold mb-6">Create New Event</h2>
//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-5">
//         <div>
//           <label className="block text-sm font-bold text-gray-700 mb-1.5">Event Name</label>
//           <input 
//             required type="text" 
//             className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
//             value={formData.name}
//             onChange={(e) => setFormData({...formData, name: e.target.value})}
//             placeholder="e.g. Yathartha 2.0"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-bold text-gray-700 mb-1.5">Assign Handler</label>
//           <select 
//             className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
//             value={formData.handler}
//             onChange={(e) => setFormData({...formData, handler: e.target.value})}
//           >
//             <option value="">Select an Approved Member</option>
//             {approvedHandlers.map(h => <option key={h.id} value={h.name}>{h.name} ({h.role})</option>)}
//           </select>
//         </div>
//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-1.5">Event Date</label>
//             <input 
//               required type="date" 
//               className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
//               value={formData.date}
//               onChange={(e) => setFormData({...formData, date: e.target.value})}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-1.5">Initial Status</label>
//             <select 
//               className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
//               value={formData.status}
//               onChange={(e) => setFormData({...formData, status: e.target.value})}
//             >
//               <option>Draft</option>
//               <option>Planned</option>
//               <option>Confirmed</option>
//             </select>
//           </div>
//         </div>
//         <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
//           Launch Event
//         </button>
//       </form>
//     </section>
//   );
// };

// // --- Sub-Component: Event List ---
// const EventList = ({ events, onEdit }) => (
//   <section className="animate-in fade-in duration-500">
//     <h2 className="text-3xl font-extrabold mb-6">Active Events</h2>
//     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//       {events.map((event) => (
//         <div key={event.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between group hover:shadow-md transition-shadow">
//           <div>
//             <div className="flex justify-between items-start mb-4">
//               <h3 className="text-xl font-bold text-slate-800">{event.name}</h3>
//               <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
//                 {event.status}
//               </span>
//             </div>
//             <div className="space-y-2.5 text-sm text-gray-500 mb-6">
//               <div className="flex items-center font-medium"><Users className="size-4 mr-2 text-slate-400" /> {event.handler || 'No Handler Assigned'}</div>
//               <div className="flex items-center"><Calendar className="size-4 mr-2 text-slate-400" /> {event.date}</div>
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <button 
//               onClick={() => onEdit(event)}
//               className="flex-1 flex items-center justify-center bg-gray-100 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-200 transition"
//             >
//               <Edit className="size-4 mr-2" /> Edit
//             </button>
//             <button className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition">
//               <Trash2 className="size-5" />
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   </section>
// );

// // --- Sub-Component: Edit Modal ---
// const EditEventModal = ({ event, onClose, onSave }) => {
//     const [editData, setEditData] = useState({...event});
//     return (
//         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
//                 <div className="p-6 border-b border-gray-100 flex justify-between items-center">
//                     <h3 className="text-xl font-bold">Edit Event</h3>
//                     <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X className="size-6" /></button>
//                 </div>
//                 <div className="p-6 space-y-4">
//                     <input 
//                         className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
//                         value={editData.name} 
//                         onChange={(e) => setEditData({...editData, name: e.target.value})}
//                     />
//                     <select 
//                         className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
//                         value={editData.status} 
//                         onChange={(e) => setEditData({...editData, status: e.target.value})}
//                     >
//                         <option>Planned</option>
//                         <option>In Progress</option>
//                         <option>Completed</option>
//                     </select>
//                 </div>
//                 <div className="p-6 pt-0 flex gap-3">
//                     <button onClick={() => onSave(editData)} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">Save Changes</button>
//                     <button onClick={onClose} className="flex-1 bg-gray-100 py-3 rounded-xl font-bold">Cancel</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminDashboard;
import React, { useState } from 'react';
import {
  Users,
  Calendar,
  PlusCircle,
  Shield,
  Edit,
  Trash2,
  X,
  LogOut
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('members');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Mock Data for Members
  const [members, setMembers] = useState([
    { id: 1, name: "Ram", role: "Member", status: "Pending" },
    { id: 2, name: "Shyam", role: "Handler", status: "Approved" },
    { id: 3, name: "Sita", role: "Handler", status: "Approved" },
  ]);

  // Events
  const [events, setEvents] = useState([
    { id: 1, name: "Tech Workshop", handler: "Shyam", date: "2026-05-20", status: "Planned" }
  ]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const addEvent = (newEvent) => {
    setEvents([...events, { ...newEvent, id: Date.now() }]);
    setActiveTab('manage-events');
  };

  const approveMember = (id) => {
    setMembers(members.map(m => m.id === id ? { ...m, status: 'Approved' } : m));
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 text-2xl font-bold border-b border-slate-800">
          ClubAdmin
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center w-full p-3 rounded-lg transition
            ${activeTab === 'members' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
          >
            <Users className="mr-3 size-5" /> Member Requests
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center w-full p-3 rounded-lg transition
            ${activeTab === 'events' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
          >
            <PlusCircle className="mr-3 size-5" /> Create Event
          </button>

          <button
            onClick={() => setActiveTab('manage-events')}
            className={`flex items-center w-full p-3 rounded-lg transition
            ${activeTab === 'manage-events' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
          >
            <Calendar className="mr-3 size-5" /> Event Management
          </button>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg text-red-400 hover:bg-slate-800 hover:text-red-300 transition"
          >
            <LogOut className="mr-3 size-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === 'members' &&
          <MemberManagement members={members} onApprove={approveMember} />
        }

        {activeTab === 'events' &&
          <EventCreation
            onEventCreated={addEvent}
            approvedHandlers={members.filter(m => m.status === 'Approved')}
          />
        }

        {activeTab === 'manage-events' &&
          <EventList events={events} onEdit={openEditModal} />
        }

        {isEditModalOpen && (
          <EditEventModal
            event={selectedEvent}
            onClose={() => setIsEditModalOpen(false)}
            onSave={(updated) => {
              setEvents(events.map(e => e.id === updated.id ? updated : e));
              setIsEditModalOpen(false);
            }}
          />
        )}
      </main>
    </div>
  );
};

/* ---------------- Member Management ---------------- */

const MemberManagement = ({ members, onApprove }) => (
  <section>
    <h2 className="text-3xl font-extrabold mb-6">Member Approval</h2>
    <div className="bg-white rounded-xl shadow border">
      <table className="w-full">
        <thead className="bg-gray-50 text-xs font-bold">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">Role</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr key={m.id} className="border-t">
              <td className="p-4">{m.name}</td>
              <td className="p-4 flex items-center">
                <Shield className="size-4 mr-1 text-blue-500" /> {m.role}
              </td>
              <td className="p-4">{m.status}</td>
              <td className="p-4 text-right">
                {m.status === "Pending" && (
                  <button
                    onClick={() => onApprove(m.id)}
                    className="bg-blue-600 text-white px-4 py-1 rounded"
                  >
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

/* ---------------- Event Creation ---------------- */

const EventCreation = ({ onEventCreated, approvedHandlers }) => {
  const [formData, setFormData] = useState({
    name: '', handler: '', date: '', status: 'Planned'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onEventCreated(formData);
  };

  return (
    <section className="max-w-xl">
      <h2 className="text-3xl font-extrabold mb-6">Create Event</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
        <input
          className="w-full border p-3 rounded"
          placeholder="Event Name"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <select
          className="w-full border p-3 rounded"
          onChange={(e) => setFormData({ ...formData, handler: e.target.value })}
        >
          <option value="">Select Handler</option>
          {approvedHandlers.map(h => (
            <option key={h.id}>{h.name}</option>
          ))}
        </select>

        <input
          type="date"
          className="w-full border p-3 rounded"
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded">
          Create Event
        </button>
      </form>
    </section>
  );
};

/* ---------------- Event List ---------------- */

const EventList = ({ events, onEdit }) => (
  <section>
    <h2 className="text-3xl font-extrabold mb-6">Events</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {events.map(event => (
        <div key={event.id} className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-bold">{event.name}</h3>
          <p>{event.handler}</p>
          <p>{event.date}</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onEdit(event)}
              className="flex-1 bg-gray-200 py-2 rounded"
            >
              <Edit className="inline size-4 mr-1" /> Edit
            </button>
            <button className="p-2 bg-red-100 rounded">
              <Trash2 className="size-5 text-red-500" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
);

/* ---------------- Edit Modal ---------------- */

const EditEventModal = ({ event, onClose, onSave }) => {
  const [editData, setEditData] = useState({ ...event });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96">
        <div className="flex justify-between mb-4">
          <h3 className="font-bold">Edit Event</h3>
          <X onClick={onClose} className="cursor-pointer" />
        </div>

        <input
          className="w-full border p-2 rounded mb-3"
          value={editData.name}
          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
        />

        <select
          className="w-full border p-2 rounded"
          value={editData.status}
          onChange={(e) => setEditData({ ...editData, status: e.target.value })}
        >
          <option>Planned</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onSave(editData)}
            className="flex-1 bg-blue-600 text-white py-2 rounded"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
