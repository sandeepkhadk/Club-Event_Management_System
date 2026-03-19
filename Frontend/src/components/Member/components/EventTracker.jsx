import React from "react";
import { Calendar } from "lucide-react";
import EventList from "../../admin/EventList";

const EventTracker = ({ events, joinedEvents, user_id, onLeave }) => (
  <section>
    <header className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-200">
      <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-xl">
        <Calendar className="w-7 h-7 text-white" />
      </div>
      <div>
        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          Event Tracker
        </h2>
        <p className="text-slate-500 mt-2 text-lg">
          {joinedEvents.length} joined event{joinedEvents.length !== 1 ? "s" : ""}
        </p>
      </div>
    </header>

    <EventList
      events={events.filter((e) => e.joined_users?.includes(user_id))}
      onLeave={onLeave}
      currentUserId={user_id}
    />
  </section>
);

export default EventTracker;
