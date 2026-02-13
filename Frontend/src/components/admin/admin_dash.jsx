// export default AdminDashboard;
import React, { useState } from 'react';
 import { useNavigate } from "react-router-dom";
 import { useAuthContext } from '../../context/provider/AuthContext';
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
const { logout } = useAuthContext()
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
  const navigate = useNavigate();

  const handleLogout = () => {
 logout()
  navigate("/"); // no page reload
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
    <div className="bg-white rounded-xl shadow border border-gray-300 overflow-hidden">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100 text-xs font-bold uppercase text-gray-700">
          <tr>
            <th className="p-4 border border-gray-300 text-left">Name</th>
            <th className="p-4 border border-gray-300 text-left">Role</th>
            <th className="p-4 border border-gray-300 text-left">Status</th>
            <th className="p-4 border border-gray-300 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {members.map(m => (
            <tr key={m.id} className="hover:bg-gray-50">
              <td className="p-4 border border-gray-300">{m.name}</td>
              <td className="p-4 border border-gray-300 flex items-center">
                <Shield className="size-4 mr-1 text-blue-500" /> {m.role}
              </td>
              <td className="p-4 border border-gray-300">{m.status}</td>
              <td className="p-4 border border-gray-300 text-right">
                {m.status === "Pending" && (
                  <button
                    onClick={() => onApprove(m.id)}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
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