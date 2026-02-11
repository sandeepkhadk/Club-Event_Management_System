import React, { useState } from "react";
import { Calendar, MapPin, User, Mail, Clock, X } from "lucide-react";
import Navbar from "../home/navbar";

const EventPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    club: "",
  });

  const events = [
    {
      id: 1,
      name: "Robotics Workshop",
      club: "Robotics Club",
      time: "Feb 15, 2026 | 2:00 PM - 5:00 PM",
      place: "Engineering Lab 2, Main Building",
      about:
        "Hands-on robotics workshop. Learn building and programming robots. All students are welcome to join.",
      contactName: "John Doe",
      contactEmail: "john@campusconnect.com",
      banner: "from-indigo-400 to-purple-500",
    },
    {
      id: 2,
      name: "Campus Art Fair",
      club: "Fine Arts Club",
      time: "Feb 20, 2026 | 10:00 AM - 4:00 PM",
      place: "Auditorium Hall",
      about:
        "Showcase your artwork or enjoy the creative exhibits from students across campus. Free entry!",
      contactName: "Emily Smith",
      contactEmail: "emily@campusconnect.com",
      banner: "from-pink-400 to-purple-500",
    },
    {
      id: 3,
      name: "Football Friendly Match",
      club: "Football Varsity",
      time: "Feb 18, 2026 | 3:00 PM - 6:00 PM",
      place: "Sports Ground",
      about:
        "Friendly match between varsity teams. Spectators are welcome to cheer for their teams.",
      contactName: "Michael Lee",
      contactEmail: "michael@campusconnect.com",
      banner: "from-green-400 to-teal-500",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Registered for ${selectedEvent.name}!\nName: ${formData.name}\nEmail: ${formData.email}`
    );
    setFormData({ name: "", email: "", contact: "", club: "" });
    setSelectedEvent(null);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-indigo-50 font-sans text-slate-800">
        {/* Header */}
        <header className="bg-gradient-to-r from-rose-500 to-pink-500 text-white py-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">Public Events</h1>
          <p className="mt-2 text-sm sm:text-base">
            Explore upcoming events organized by campus clubs.
          </p>
        </header>

        {/* Event Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden
                         hover:shadow-xl transition transform hover:-translate-y-1"
            >
              {/* Banner */}
              <div
                className={`h-28 bg-gradient-to-r ${event.banner} flex items-center justify-center text-white font-semibold text-lg`}
              >
                {event.club}
              </div>

              <div className="p-6 space-y-3">
                <h2 className="text-lg font-bold text-slate-900">{event.name}</h2>

                {/* Event Info */}
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Clock size={14} /> {event.time}
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <MapPin size={14} /> {event.place}
                </div>

                {/* About */}
                <p className="text-gray-500 text-sm line-clamp-4">{event.about}</p>

                {/* Contact */}
                <div className="flex items-center gap-4 text-gray-600 text-sm mt-2">
                  <div className="flex items-center gap-1">
                    <User size={14} /> {event.contactName}
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail size={14} /> {event.contactEmail}
                  </div>
                </div>

                {/* Register Button */}
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="mt-3 w-full bg-gradient-to-r from-indigo-500 to-purple-500
                             text-white py-2 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition"
                >
                  Register for Event
                </button>
              </div>
            </div>
          ))}
        </main>

        {/* Registration Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-lg">
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 transition"
              >
                <X size={20} />
              </button>

              <h3 className="text-xl font-bold mb-4 text-center text-slate-900">
                Register for {selectedEvent.name}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Contact Number"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Your Club (optional)"
                  value={formData.club}
                  onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition"
                >
                  Submit Registration
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EventPage;
