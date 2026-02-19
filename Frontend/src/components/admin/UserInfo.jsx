// UserInfo.jsx - w-64 sidebar + Username included
import React, { useState, useEffect } from 'react';
import { useAuthContext } from "../../context/provider/AuthContext";
import { User, Crown, Building2 } from 'lucide-react';
import apiUrl from '../../api';

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthContext();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${apiUrl}users/profile/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUserInfo(data);
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center gap-3 p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 mx-2 mb-4">
        <div className="w-10 h-10 bg-slate-700/50 rounded-xl animate-pulse"></div>
        <div className="space-y-1 flex-1">
          <div className="h-3 bg-slate-700/50 rounded animate-pulse w-20"></div>
          <div className="h-2.5 bg-slate-700/30 rounded animate-pulse w-16"></div>
        </div>
      </div>
    );
  }

  if (!userInfo) return null;

  const isAdmin = userInfo.club_role === 'admin';

  return (
    <div className="group relative p-4 bg-slate-800/70 hover:bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700/50 mx-2 mb-6 shadow-lg hover:shadow-xl hover:border-slate-600/70 transition-all duration-300 overflow-hidden">
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12" />
      
      <div className="relative z-10 flex items-center gap-3">
        {/* Compact Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md border-2 border-slate-700/50 group-hover:border-indigo-400/60 transition-all">
            <User className="w-6 h-6 text-indigo-300 drop-shadow-sm" />
          </div>
          {isAdmin && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400/90 to-orange-500/90 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900">
              <Crown className="w-3 h-3 text-white drop-shadow-sm" />
            </div>
          )}
        </div>

        {/* Content with Username + Club */}
        <div className="flex-1 min-w-0 space-y-1 pr-2">
          {isAdmin ? (
            /* Admin: Username + Club + Admin */
            <>
              <div className="text-xs font-bold text-slate-200 truncate max-w-[110px]">
                {userInfo.name}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 truncate">
                <Building2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span className="group-hover:text-indigo-300 transition-colors">{userInfo.club_name }</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-2 py-px rounded-lg backdrop-blur-sm border border-yellow-500/30">
                <Crown className="w-3 h-3 text-yellow-300" />
                <span className="text-yellow-200 uppercase tracking-wider">Admin</span>
              </div>
            </>
          ) : (
            /* Member: Username + Club */
            <>
              <div className="text-xs font-bold text-slate-200 truncate max-w-[110px]">
              {userInfo ? `${userInfo.name}'s Dashboard` : "Dashboard"}
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-300 bg-emerald-500/10 px-1.5 py-px rounded border border-emerald-500/30 backdrop-blur-sm truncate max-w-[110px]">
                <Building2 className="w-3 h-3 flex-shrink-0" />
                <span>{userInfo.club_name }</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
