import React from "react";
import { Users } from "lucide-react";

const ClubStatusBadge = ({ status, pendingApp, submitting, onJoin, clubId }) => {
  if (status === "approved") {
    return (
      <div className="w-full p-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-3xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl animate-pulse">
        <div className="w-3 h-3 bg-white rounded-full animate-ping" />
        Active Member
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="w-full p-5 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 rounded-3xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl opacity-90">
        <div className="w-3 h-3 bg-amber-900 rounded-full animate-ping" />
        Request Pending
        {pendingApp && (
          <span className="text-xs bg-white/30 px-2 py-1 rounded-xl ml-2" />
        )}
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="w-full p-5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-3xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl">
        ❌ Request Rejected
      </div>
    );
  }

  return (
    <button
      onClick={() => onJoin(clubId)}
      disabled={submitting}
      className="w-full p-6 bg-gradient-to-r from-slate-100 via-indigo-50 to-purple-50 text-slate-900 rounded-3xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 border-2 border-slate-200/50 hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:from-indigo-500 hover:to-purple-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 group/button disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {submitting ? (
        <>
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Users className="w-6 h-6 group-hover/button:-translate-y-0.5 transition-transform" />
          Apply to Join
        </>
      )}
    </button>
  );
};

const ExploreClubs = ({ clubs, myApplications, submitting, getClubStatus, onJoin }) => (
  <section aria-labelledby="explore-clubs-title">
    <header className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-200">
      <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-xl">
        <Users className="w-7 h-7 text-white" />
      </div>
      <div>
        <h2
          id="explore-clubs-title"
          className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight"
        >
          Explore Clubs
        </h2>
        <p className="text-slate-500 mt-2 text-lg">Discover your next passion</p>
      </div>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {clubs.map((club) => {
        const status = getClubStatus(club.club_id);
        const pendingApp = myApplications.find((app) => app.club_id === club.club_id);

        return (
          <article
            key={club.club_id}
            className="group relative bg-white/70 backdrop-blur-xl rounded-4xl border border-slate-200/50 p-10 shadow-2xl hover:shadow-3xl hover:-translate-y-4 hover:border-indigo-300/70 transition-all duration-500 overflow-hidden hover:bg-white"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/3 to-purple-500/3 opacity-0 group-hover:opacity-100 transition-all duration-500" />

            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-indigo-100 transition-all duration-300 mx-auto">
                <Users className="w-10 h-10 text-slate-500 group-hover:text-indigo-600 transition-colors" />
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-4 text-center group-hover:text-indigo-600 transition-colors leading-tight">
                {club.club_name}
              </h3>

              <p className="text-slate-500 text-lg mb-10 text-center leading-relaxed line-clamp-3 px-4">
                {club.description ||
                  "Join us to learn new skills and connect with peers who share your interests."}
              </p>

              <div className="space-y-3">
                <ClubStatusBadge
                  status={status}
                  pendingApp={pendingApp}
                  submitting={submitting}
                  onJoin={onJoin}
                  clubId={club.club_id}
                />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  </section>
);

export default ExploreClubs;