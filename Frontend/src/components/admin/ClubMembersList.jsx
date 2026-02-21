// ClubMembersList.jsx
import React, { useState } from 'react';
import { Users, User, Shield, Clock, CheckCircle, Search, Trash2, Crown } from 'lucide-react';
import { useAuthContext } from "../../context/provider/AuthContext";

const ClubMembersList = ({ members = [], handleRemoveMember }) => {
  const { userInfo } = useAuthContext();
  const [search, setSearch] = useState('');

  const filtered = members.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase())
  );

  const approvedCount = members.filter(m => m.status?.toLowerCase() === 'approved').length;

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#39D353]/15 text-[#25a83d] border border-[#39D353]/30">
            <CheckCircle className="w-3 h-3" /> Approved
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-600 border border-amber-300/50">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
            <User className="w-3 h-3" /> Unknown
          </span>
        );
    }
  };

  const getRoleChip = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-600 border border-orange-200">
            <Crown className="w-3 h-3" /> Admin
          </span>
        );
      case 'moderator':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-600 border border-purple-200">
            <Shield className="w-3 h-3" /> Moderator
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
            <User className="w-3 h-3" /> Member
          </span>
        );
    }
  };

  // Generate a consistent avatar gradient based on name
  const getAvatarGradient = (name = '') => {
    const colors = [
      'from-violet-400 to-purple-500',
      'from-blue-400 to-cyan-500',
      'from-emerald-400 to-teal-500',
      'from-rose-400 to-pink-500',
      'from-amber-400 to-orange-500',
      'from-indigo-400 to-blue-500',
    ];
    const idx = (name.charCodeAt(0) || 0) % colors.length;
    return colors[idx];
  };

  return (
    <div className="space-y-5">

      {/* ── Header Card ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4
        p-5 bg-slate-900 rounded-2xl shadow-xl">

        <div className="flex items-center gap-4">
          {/* Icon circle */}
          <div className="w-12 h-12 rounded-xl bg-[#39D353]/15 border border-[#39D353]/30
            flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-[#39D353]" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">Club Members</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {members.length} total &nbsp;·&nbsp;
              <span className="text-[#39D353] font-semibold">{approvedCount} approved</span>
            </p>
          </div>
        </div>

        {/* Stats pill */}
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-[#39D353]/10 border border-[#39D353]/25 rounded-xl">
            <span className="text-2xl font-black text-[#39D353]">{members.length}</span>
            <span className="text-xs text-slate-400 ml-1">members</span>
          </div>
        </div>
      </div>

      {/* ── Search Bar ──────────────────────────────────── */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search members..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl
            text-sm text-slate-700 placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-[#39D353]/40 focus:border-[#39D353]
            shadow-sm transition-all duration-200"
        />
      </div>

      {/* ── Members List ────────────────────────────────── */}
      <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1
        scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">

        {filtered.length > 0 ? (
          filtered.map((member, idx) => (
            <div
              key={member.user_id}
              className="group flex items-center justify-between gap-3 p-4
                bg-white hover:bg-slate-50
                border border-slate-100 hover:border-[#39D353]/30
                rounded-xl shadow-sm hover:shadow-md
                transition-all duration-200"
            >
              {/* Left: Avatar + Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">

                {/* Avatar */}
                <div className={`
                  w-11 h-11 flex-shrink-0 rounded-xl
                  bg-gradient-to-br ${getAvatarGradient(member.name)}
                  flex items-center justify-center shadow-md
                  group-hover:scale-105 transition-transform duration-200
                `}>
                  <span className="text-base font-black text-white">
                    {member.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>

                {/* Name + badges */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="text-sm font-bold text-slate-800 truncate max-w-[160px]">
                      {member.name || 'Unknown User'}
                    </span>
                    {getStatusBadge(member.status)}
                  </div>
                  {getRoleChip(member.role)}
                </div>
              </div>

              {/* Right: Remove button */}
              {userInfo?.club_role === 'admin' && member.role !== 'admin' && (
                <button
                  onClick={() => handleRemoveMember(member.user_id)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2
                    bg-red-50 hover:bg-red-500
                    text-red-500 hover:text-white
                    text-xs font-bold rounded-xl border border-red-200 hover:border-red-500
                    shadow-sm hover:shadow-md
                    transition-all duration-200 opacity-0 group-hover:opacity-100"
                  title="Remove member"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Users className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-base font-bold text-slate-600 mb-1">
              {search ? 'No members found' : 'No Members Yet'}
            </h3>
            <p className="text-sm text-slate-400">
              {search ? `No results for "${search}"` : 'Approve pending requests to add members.'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ClubMembersList;