import React from "react";
import { GraduationCap, LogOut } from "lucide-react";

const DashboardHeader = ({ myProfile, onLogout }) => (
  <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-4 group">
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg group-hover:scale-105 transition-all">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-black bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
            Student Dashboard
          </h1>
          {myProfile && (
            <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Welcome, {myProfile.username || myProfile.name}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={onLogout}
        className="group flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-rose-600 bg-slate-100/50 hover:bg-rose-50 rounded-2xl border hover:border-rose-200 transition-all shadow-sm"
      >
        <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Sign Out
      </button>
    </div>
  </header>
);

export default DashboardHeader;
