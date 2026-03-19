import React from "react";
import { Home, Users, Calendar } from "lucide-react";
import EventList from "../../admin/EventList";

const MyClubs = ({ myClubs, clubEvents, user_id, onJoinClubEvent, onLeave }) => (
  <section>
    <header className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-200">
      <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-xl">
        <Home className="w-7 h-7 text-white" />
      </div>
      <div>
        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          My Clubs
        </h2>
        <p className="text-slate-500 mt-2 text-lg">
          {myClubs.length} active communities
        </p>
      </div>
    </header>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {myClubs.map((club) => (
        <article
          key={club.club_id}
          className="group bg-white/70 backdrop-blur-xl rounded-4xl border border-slate-200/50 p-10 shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-start gap-6 mb-8 pb-8 border-b border-slate-200/50">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all shrink-0">
                <Users className="w-9 h-9 text-white" />
              </div>
              <div className="min-w-0 flex-1 pt-2">
                <h3 className="text-3xl font-black text-slate-900 group-hover:text-indigo-600 mb-2">
                  {club.club_name}
                </h3>
                <p className="text-slate-500 text-lg">
                  {club.description || "Your club home base"}
                </p>
              </div>
            </div>

            <h4 className="font-black text-xl text-slate-800 mb-6 flex items-center gap-3 pb-4 border-b border-slate-200/30">
              <Calendar className="w-6 h-6 text-indigo-500" />
              Club Events
            </h4>

            {clubEvents[club.club_id]?.length > 0 ? (
              <EventList
                events={clubEvents[club.club_id]}
                onJoin={(event) => onJoinClubEvent(event, club.club_id)}
                onLeave={onLeave}
                currentUserId={user_id}
                club_role={null}
                onDelete={null}
              />
            ) : (
              <div className="text-center py-16 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-3xl border-2 border-dashed border-slate-200/50">
                <Calendar className="mx-auto h-16 w-16 text-slate-300 mb-6" />
                <h5 className="text-xl font-bold text-slate-500 mb-3">No Events Yet</h5>
                <p className="text-slate-400 mb-8">Stay tuned for upcoming events.</p>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default MyClubs;
