import React, { useState, useMemo } from "react";
import { Clock, ChevronRight, Trash2, X, Pencil } from "lucide-react";

const EventList = ({
  events = [],
  onJoin,
  onLeave,
  onDelete,
  onEdit,
  currentUserId,
  currentUserRole,
}) => {
  const [filter, setFilter] = useState("all");

  const gradients = [
    "from-indigo-700 to-indigo-500",
    "from-purple-700 to-purple-450",
    "from-rose-700 to-rose-500",
    "from-teal-700 to-teal-500",
    "from-orange-700 to-orange-500",
    "from-sky-700 to-sky-500",
  ];

  const now = new Date();

  // 🔹 Format + compute event state only when events change
  const formattedEvents = useMemo(() => {
    return events.map((e, index) => {
      const start = new Date(e.start_datetime);
      const end = new Date(e.end_datetime);

      let computedStatus = "Upcoming";

      if (end < now) {
        computedStatus = "Completed";
      } else if (start <= now && end >= now) {
        computedStatus = "Active";
      }

      return {
        ...e,
        id: e.event_id,
        joined: e.joined_users?.includes(currentUserId) || false,
        computedStatus,
        month: start.toLocaleString("en-US", { month: "short" }),
        day: start.getDate(),
        time: start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        fullDate: start.toLocaleDateString([], {
          dateStyle: "medium",
        }),
        banner: gradients[index % gradients.length],
        isCompleted: computedStatus === "Completed",
      };
    });
  }, [events, currentUserId]);

  // 🔹 Filter logic
  const filteredEvents = useMemo(() => {
    if (filter === "all") return formattedEvents;
    return formattedEvents.filter(
      (e) => e.computedStatus.toLowerCase() === filter
    );
  }, [filter, formattedEvents]);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 relative z-20">
      {/* ================= FILTER BUTTONS ================= */}
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

      {/* ================= EVENT GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            // 🔹 Permission logic
            const isAdmin = currentUserRole === "admin";
            const isHandler =
              String(event.handler_id) === String(currentUserId);

            const canEdit = onEdit && ( isHandler);

            return (
              <div
                key={`event-${event.id}`}
                className={`group rounded-2xl overflow-hidden border transition-all duration-500 hover:-translate-y-1 ${
                  event.isCompleted
                    ? "bg-slate-100 border-slate-200"
                    : "bg-white shadow-xl border-white hover:border-indigo-100"
                }`}
              >
                {/* ================= BANNER ================= */}
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
                          ? "bg-slate-400 text-white"
                          : "bg-white/20 text-white border border-white/30 backdrop-blur-md"
                      }`}
                    >
                      {event.computedStatus}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* EDIT BUTTON */}
                      {canEdit && (
                        <button
                          onClick={() => onEdit(event)}
                          title="Edit Event"
                          className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white border border-white/30 backdrop-blur-md transition-all duration-200"
                        >
                          <Pencil size={13} />
                        </button>
                      )}

                      {/* DATE CARD */}
                      <div className="bg-white rounded-xl p-2 shadow text-center min-w-[50px]">
                        <p className="text-[10px] font-black text-indigo-600 uppercase leading-none">
                          {event.month}
                        </p>
                        <p className="text-lg font-black text-slate-800">
                          {event.day}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4">
                    <h2
                      className={`text-xl font-black leading-tight italic ${
                        event.isCompleted
                          ? "text-slate-600"
                          : "text-white group-hover:scale-105 transition-transform origin-left"
                      }`}
                    >
                      {event.title}
                    </h2>
                  </div>
                </div>

                {/* ================= CONTENT ================= */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Clock
                      size={16}
                      className={
                        event.isCompleted
                          ? "text-slate-500"
                          : "text-indigo-600"
                      }
                    />
                    <span
                      className={
                        event.isCompleted
                          ? "text-slate-500"
                          : "text-slate-700"
                      }
                    >
                      {event.fullDate} @ {event.time}
                    </span>
                  </div>

                  <p
                    className={`text-sm leading-relaxed line-clamp-2 ${
                      event.isCompleted
                        ? "text-slate-500"
                        : "text-slate-400"
                    }`}
                  >
                    {event.description || "No description"}
                  </p>

                  {/* ================= FOOTER ================= */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">
                        Handler
                      </span>
                      <span className="text-xs font-black text-slate-700">
                        {event.handler_name}
                      </span>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {!event.isCompleted && !event.joined && onJoin && (
                        <button
                          onClick={() => onJoin(event)}
                          className="flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg font-semibold text-sm hover:bg-indigo-100 transition-all active:scale-95"
                        >
                          Join <ChevronRight size={14} />
                        </button>
                      )}

                      {!event.isCompleted && event.joined && onLeave && (
                        <button
                          onClick={() => onLeave(event)}
                          className="flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg font-semibold text-sm hover:bg-amber-100 transition-all active:scale-95"
                        >
                          Leave <X size={14} />
                        </button>
                      )}

                      {onDelete && isAdmin && (
                        <button
                          onClick={() => onDelete(event)}
                          className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg font-semibold text-sm hover:bg-red-100 transition-all active:scale-95"
                        >
                          Delete <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-white rounded-2xl p-16 text-center border-4 border-dashed border-slate-100">
            <p className="text-slate-400 font-bold">
              No events found.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventList;