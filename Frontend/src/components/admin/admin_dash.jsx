import React, { useState } from 'react';
import { Users, Calendar, PlusCircle, CheckCircle, Shield } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('members');

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-slate-800">Admin Panel</div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('members')}
            className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'members' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
          >
            <Users className="mr-3 size-5" /> Members Approval
          </button>
          <button 
            onClick={() => setActiveTab('events')}
            className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'events' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
          >
            <PlusCircle className="mr-3 size-5" /> Create Event
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === 'members' ? <MemberManagement /> : <EventCreation />}
      </main>
    </div>
  );
};

// --- Sub-Component: Member Management ---
const MemberManagement = () => {
  // Mock data - eventually fetched from your Django API
  const members = [
    { id: 1, name: "Alice Smith", role: "Member", status: "Pending" },
    { id: 2, name: "Bob Johnson", role: "Handler", status: "Approved" },
  ];

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold">Member Management</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 font-semibold">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="p-4">{m.name}</td>
                <td className="p-4">
                  <span className="flex items-center text-sm font-medium">
                    <Shield className="size-4 mr-1 text-blue-500" /> {m.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${m.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                    {m.status}
                  </span>
                </td>
                <td className="p-4">
                  {m.status === 'Pending' && (
                    <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition">Approve</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

// --- Sub-Component: Event Creation ---
const EventCreation = () => {
  return (
    <section className="max-w-2xl space-y-6">
      <h2 className="text-3xl font-bold">Create New Event</h2>
      <form className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Event Name</label>
          <input type="text" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Annual Sports Day" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Assign Handler</label>
          <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
            <option>Select an Approved Member...</option>
            <option>Bob Johnson (Handler)</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input type="date" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Initial Status</label>
            <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Draft</option>
              <option>Planned</option>
            </select>
          </div>
        </div>
        <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition mt-4">Create Event</button>
      </form>
    </section>
  );
};

export default AdminDashboard;