import React, { useState } from "react";
import { Clock, ChevronRight, Trash2, X } from "lucide-react";

const EventList = ({ events, onJoin, onLeave, onDelete, currentUserId, currentUserRole }) => {
  const [filter, setFilter] = useState("all"); // initial filter

  const gradients = [
    "from-blue-500 to-indigo-500",
    "from-purple-600 to-pink-500",
    "from-rose-500 to-orange-400",
    "from-emerald-500 to-teal-400",
  ];

  const now = new Date();

  // Filter events based on status
  const filteredEvents = events.filter((e) => {
    const start = new Date(e.start_datetime);
    const end = new Date(e.end_datetime);

    if (isNaN(start) || isNaN(end)) return false;

    switch (filter) {
      case "upcoming":
        return start.getTime() > now.getTime();
      case "completed":
        return end.getTime() < now.getTime();
      case "active":
        return start.getTime() <= now.getTime() && end.getTime() >= now.getTime();
      default:
        return true;
    }
  });

  // Format events for display
  const formattedEvents = filteredEvents.map((e, index) => {
    const startDate = new Date(e.start_datetime);
    const endDate = new Date(e.end_datetime);
    const isCompleted = endDate.getTime() < now.getTime();

    return {
      id: e.event_id,
      title: e.title,
      description: e.description || "No description",
      start_datetime: e.start_datetime,
      end_datetime: e.end_datetime,
      status: e.status,
      club_id: e.club_id,
      handler_id: e.handler_id,
      handler_name: e.handler_name,
      joined: e.joined_users?.includes(currentUserId) || false,
      month: startDate.toLocaleString("en-US", { month: "short" }),
      day: startDate.getDate(),
      time: startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      fullDate: startDate.toLocaleDateString([], { dateStyle: "medium" }),
     
      banner: gradients[index % gradients.length],
      isCompleted,
    };
  });

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 relative z-20">
      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {["all", "active", "upcoming", "completed"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full font-bold text-sm uppercase transition-all border ${
              filter === type
                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Event Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {formattedEvents.length > 0 ? (
          formattedEvents.map((event) => (
            <div
              key={`event-${event.id}`}
              className={`group rounded-2xl overflow-hidden border transition-all duration-500 hover:-translate-y-1 ${
                event.isCompleted
                  ? "bg-slate-100 border-slate-200"
                  : "bg-white shadow-xl border-white hover:border-indigo-100"
              }`}
            >
              {/* Banner */}
              <div
                className={`h-40 relative p-4 ${
                  event.isCompleted
                    ? "bg-slate-300"
                    : `bg-gradient-to-br ${event.banner}`
                }`}
              >
                <div className="flex justify-between items-start">
                  <div
                    className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      event.isCompleted
                        ? "bg-slate-400 text-white border-none"
                        : "bg-white/20 text-white border border-white/30 backdrop-blur-md"
                    }`}
                  >
                    {event.status}
                  </div>
                  <div className="bg-white rounded-xl p-2 shadow text-center min-w-[50px]">
                    <p className="text-[10px] font-black text-indigo-600 uppercase leading-none">
                      {event.month}
                    </p>
                    <p className="text-lg font-black text-slate-800">{event.day}</p>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4">
                  <h2
                    className={`text-xl font-black leading-tight italic ${
                      event.isCompleted ? "text-slate-600" : "text-white group-hover:scale-105 transition-transform origin-left"
                    }`}
                  >
                    {event.title}
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                  <div className="p-2 rounded-xl">
                    <Clock size={16} className={event.isCompleted ? "text-slate-500" : "text-indigo-600"} />
                  </div>
                  <span className={event.isCompleted ? "text-slate-500" : "text-slate-700"}>
                    {event.fullDate} @ {event.time}
                  </span>
                </div>

                <p className={`text-sm leading-relaxed line-clamp-2 ${event.isCompleted ? "text-slate-500" : "text-slate-400"}`}>
                  {event.description}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Handler</span>
                    <span className="text-xs font-black text-slate-700">{event.handler_name}</span>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {/* Only show Join/Leave if event is not completed */}
                    {!event.isCompleted && !event.joined && onJoin && (
                      <button
                        onClick={() => onJoin(event)}
                        className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-2xl font-bold text-sm hover:bg-indigo-600 transition-all active:scale-95 shadow"
                      >
                        Join <ChevronRight size={14} />
                      </button>
                    )}

                    {!event.isCompleted && event.joined && onLeave && (
                      <button
                        onClick={() => onLeave(event)}
                        className="flex items-center gap-2 bg-yellow-500 text-white px-3 py-1.5 rounded-2xl font-bold text-sm hover:bg-yellow-600 transition-all active:scale-95 shadow"
                      >
                        Leave <X size={14} />
                      </button>
                    )}

                    {onDelete && currentUserRole === "admin" && (
                      <button
                        onClick={() => onDelete(event)}
                        className="flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-2xl font-bold text-sm hover:bg-red-700 transition-all active:scale-95 shadow"
                      >
                        Delete <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-2xl p-16 text-center border-4 border-dashed border-slate-100">
            <p className="text-slate-400 font-bold">No events found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventList;
