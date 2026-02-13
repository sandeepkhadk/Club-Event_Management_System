import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Calendar, PlusCircle, UserCheck, LogOut } from 'lucide-react';
import { AuthProvider } from '../../context/provider/AuthContext';
import { useAuthContext } from '../../context/provider/AuthContext';

const MemberDashboard = () => {
  const {logout}=useAuthContext()
  const [activeTab, setActiveTab] = useState('events'); // default to events
  const [events, setEvents] = useState([
    { id: 1, name: "Tech Workshop", handler: "Shyam", date: "2026-05-20", status: "Planned", participants: [] }
  ]);
  const [proposedEvents, setProposedEvents] = useState([]);
  const [showProposeForm, setShowProposeForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', date: '' });

  const navigate = useNavigate();
  const handleLogout = () => {
   logout()
    navigate("/"); // redirect to login/home
  };

  const applyAsHandler = (eventId) => {
    alert("Handler request sent for event!");
    // Here you could send this to backend
  };

  const participateInEvent = (eventId) => {
    setEvents(events.map(e => e.id === eventId ? { ...e, participants: [...e.participants, "You"] } : e));
    alert("You are now participating in the event!");
  };

  const proposeEvent = (e) => {
    e.preventDefault();
    setProposedEvents([...proposedEvents, { ...newEvent, id: Date.now(), status: 'Proposed' }]);
    setNewEvent({ name: '', date: '' });
    setShowProposeForm(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 text-2xl font-bold border-b border-slate-800">
          ClubMember
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center w-full p-3 rounded-lg transition
            ${activeTab === 'events' ? 'bg-rose-500' : 'hover:bg-slate-800'}`}
          >
            <Calendar className="mr-3 size-5" /> Club Events
          </button>

          <button
            onClick={() => setActiveTab('propose')}
            className={`flex items-center w-full p-3 rounded-lg transition
            ${activeTab === 'propose' ? 'bg-rose-500' : 'hover:bg-slate-800'}`}
          >
            <PlusCircle className="mr-3 size-5" /> Propose Event
          </button>

          <button
            onClick={() => setActiveTab('participation')}
            className={`flex items-center w-full p-3 rounded-lg transition
            ${activeTab === 'participation' ? 'bg-rose-500' : 'hover:bg-slate-800'}`}
          >
            <UserCheck className="mr-3 size-5" /> My Participation
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
        {activeTab === 'events' && (
          <EventList
            events={events}
            onApplyHandler={applyAsHandler}
            onParticipate={participateInEvent}
          />
        )}

        {activeTab === 'propose' && (
          <div className="max-w-xl">
            {!showProposeForm ? (
              <button
                className="bg-rose-500 text-white px-4 py-2 rounded"
                onClick={() => setShowProposeForm(true)}
              >
                Propose New Event
              </button>
            ) : (
              <form
                onSubmit={proposeEvent}
                className="bg-white p-6 rounded-xl shadow space-y-4 mt-4"
              >
                <input
                  className="w-full border p-3 rounded"
                  placeholder="Event Name"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                  required
                />
                <input
                  type="date"
                  className="w-full border p-3 rounded"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  required
                />
                <div className="flex gap-2">
                  <button className="flex-1 bg-rose-500 text-white py-2 rounded">Submit</button>
                  <button
                    type="button"
                    className="flex-1 bg-gray-200 py-2 rounded"
                    onClick={() => setShowProposeForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {activeTab === 'participation' && (
          <section>
            <h2 className="text-3xl font-extrabold mb-6">My Participations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.filter(e => e.participants.includes("You")).map(e => (
                <div key={e.id} className="bg-white p-5 rounded-xl shadow">
                  <h3 className="font-bold">{e.name}</h3>
                  <p>Handler: {e.handler}</p>
                  <p>Date: {e.date}</p>
                  <p>Status: {e.status}</p>
                </div>
              ))}
              {events.filter(e => e.participants.includes("You")).length === 0 && (
                <p>You have not joined any events yet.</p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

/* ---------------- Event List Component ---------------- */
const EventList = ({ events, onApplyHandler, onParticipate }) => (
  <section>
    <h2 className="text-3xl font-extrabold mb-6">Club Events</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {events.map(event => (
        <div key={event.id} className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-bold">{event.name}</h3>
          <p>Handler: {event.handler}</p>
          <p>Date: {event.date}</p>
          <p>Status: {event.status}</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onApplyHandler(event.id)}
              className="flex-1 bg-blue-600 text-white py-2 rounded"
            >
              Apply as Handler
            </button>
            <button
              onClick={() => onParticipate(event.id)}
              className="flex-1 bg-green-600 text-white py-2 rounded"
            >
              Participate
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default MemberDashboard;
