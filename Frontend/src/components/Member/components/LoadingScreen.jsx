import React from "react";
import { GraduationCap } from "lucide-react";

const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center p-8">
    <div className="text-center max-w-md mx-auto space-y-6">
      <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl flex items-center justify-center mx-auto animate-pulse">
        <GraduationCap className="w-12 h-12 text-white drop-shadow-lg" />
      </div>
      <h2 className="text-4xl font-black bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent tracking-tight">
        Syncing Dashboard
      </h2>
    </div>
  </div>
);

export default LoadingScreen;
