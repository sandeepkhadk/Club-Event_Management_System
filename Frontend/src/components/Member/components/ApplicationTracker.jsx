import React from "react";
import { Activity, Users, Calendar } from "lucide-react";

const ApplicationTracker = ({ myApplications }) => (
  <section aria-labelledby="applications-title">
    <header className="flex items-center gap-3 mb-10 pb-8 border-b border-slate-200">
      <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
        <Activity className="w-6 h-6 text-white" />
      </div>
      <div>
        <h2
          id="applications-title"
          className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight"
        >
          Your Club Requests
        </h2>
        <p className="text-slate-500 mt-2 text-lg">
          {myApplications.length} request{myApplications.length !== 1 ? "s" : ""}
        </p>
      </div>
    </header>

    {myApplications.length ? (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {myApplications.map((app, idx) => (
          <article
            key={idx}
            className="group bg-gradient-to-r from-indigo-50/80 to-purple-50/60 backdrop-blur-xl border border-indigo-200/60 hover:border-indigo-300 p-8 lg:p-10 rounded-4xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity -skew-x-3" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl flex-shrink-0">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600">
                      {app.club_name}
                    </h3>
                    <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mt-1">
                      Membership Request
                    </p>
                  </div>
                </div>

                <div
                  className={`px-6 py-3 rounded-3xl font-black text-sm uppercase tracking-widest shadow-lg flex items-center gap-2 ${
                    app.status === "Approved"
                      ? "bg-emerald-500/90 text-white shadow-emerald-500/25 animate-pulse"
                      : app.status === "Rejected"
                      ? "bg-rose-500/90 text-white shadow-rose-500/25"
                      : "bg-amber-500/90 text-white shadow-amber-500/25 animate-pulse"
                  }`}
                >
                  {app.status || "Pending"}
                </div>
              </div>

              {app.reason && (
                <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/50 shadow-xl">
                  <p className="text-slate-700 text-base leading-relaxed italic">
                    "{app.reason}"
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t border-slate-200/50">
                <span className="text-sm font-bold text-slate-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {app.created_at
                    ? new Date(app.created_at).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    ) : (
      <div className="p-20 lg:p-24 bg-gradient-to-br from-indigo-50/70 to-purple-50/50 backdrop-blur-xl border-2 border-dashed border-indigo-200/60 rounded-4xl text-center shadow-2xl">
        <div className="w-28 h-28 bg-gradient-to-br from-slate-100/60 to-indigo-100/60 backdrop-blur-xl rounded-4xl flex items-center justify-center mx-auto mb-10 border-2 border-slate-200/50 shadow-xl">
          <Users className="w-14 h-14 text-slate-500" />
        </div>
        <h3 className="text-3xl lg:text-4xl font-black text-slate-800 mb-6">
          No Requests Yet
        </h3>
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
          Apply to clubs to see your request status here.
        </p>
      </div>
    )}
  </section>
);

export default ApplicationTracker;
