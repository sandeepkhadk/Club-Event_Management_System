import React from "react";
import { Clock, ChevronRight, Trash2, X } from "lucide-react";

const EventList = ({ events, onJoin, onLeave, onDelete, currentUserId, currentUserRole }) => {
  const gradients = [
    "from-blue-500 to-indigo-500",
    "from-purple-600 to-pink-500",
    "from-rose-500 to-orange-400",
    "from-emerald-500 to-teal-400"
  ];

  const formattedEvents = events.map((e, index) => {
    const startDate = new Date(e.start_datetime);
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
      joined: e.joined_users?.includes(currentUserId) || false, // check if current user joined
      month: startDate.toLocaleString("en-US", { month: "short" }),
      day: startDate?.getDate() || "",
      time: startDate.toLocaleString([], { hour: "2-digit", minute: "2-digit" }),
      fullDate: startDate.toLocaleDateString([], { dateStyle: "medium" }),
      banner: gradients[index % gradients.length]
    };
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-20 pb-20 relative z-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {formattedEvents.length > 0 ? (
        formattedEvents.map((event) => (
          <div
            key={`event-${event.id}`}
            className="group bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-white hover:border-indigo-100 transition-all duration-500 hover:-translate-y-3"
          >
            {/* Banner */}
            <div className={`h-44 bg-gradient-to-br ${event.banner} relative p-6`}>
              <div className="flex justify-between items-start">
                <div className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-widest">
                  {event.status}
                </div>
                <div className="bg-white rounded-2xl p-2 shadow-xl text-center min-w-[55px]">
                  <p className="text-[10px] font-black text-indigo-600 uppercase leading-none">{event.month}</p>
                  <p className="text-2xl font-black text-slate-800">{event.day}</p>
                </div>
              </div>
              <div className="absolute bottom-6 left-6">
                <h2 className="text-white text-2xl font-black leading-tight group-hover:scale-105 transition-transform origin-left italic">
                  {event.title}
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-5">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-slate-500 text-sm font-semibold">
                  <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                    <Clock size={18} />
                  </div>
                  {event.fullDate} @ {event.time}
                </div>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{event.description}</p>

              <div className="pt-4 border-t border-slate-50 flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Handler</span>
                  <span className="text-xs font-black text-slate-700">{event.handler_name}</span>
                </div>

                {/* Toggle Join / Leave and Delete */}
                <div className="flex gap-2">
                  {!event.joined && onJoin && (
                    <button
                      onClick={() => onJoin(event)}
                      className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-2xl font-bold text-sm hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200 hover:shadow-indigo-200"
                    >
                      Join <ChevronRight size={16} />
                    </button>
                  )}

                  {event.joined && onLeave && (
                    <button
                      onClick={() => onLeave(event)}
                      className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-2xl font-bold text-sm hover:bg-yellow-600 transition-all active:scale-95 shadow-lg shadow-yellow-200"
                    >
                      Leave <X size={16} />
                    </button>
                  )}

                  {/* Delete only for admin */}
                  {onDelete && currentUserRole === "admin" && (
                    <button
                      onClick={() => onDelete(event)}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-2xl font-bold text-sm hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-200"
                    >
                      Delete <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full bg-white rounded-3xl p-20 text-center border-4 border-dashed border-slate-100">
          <p className="text-slate-400 font-bold">No events found.</p>
        </div>
      )}
    </section>
  );
};

export default EventList;
