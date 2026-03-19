import React from "react";
import { Calendar } from "lucide-react";
import EventList from "../../admin/EventList";

const LiveEvents = ({ events, user_id, onJoin, onLeave }) => (
  <section>
    <header className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-200">
      <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-xl">
        <Calendar className="w-7 h-7 text-white" />
      </div>
      <div>
        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          Live Events
        </h2>
        <p className="text-slate-500 mt-2 text-lg">
          Join exciting activities across campus
        </p>
      </div>
    </header>

    <EventList
      events={events}
      onJoin={onJoin}
      onLeave={onLeave}
      currentUserId={user_id}
      club_role={null}
      onDelete={null}
    />
  </section>
);

export default LiveEvents;