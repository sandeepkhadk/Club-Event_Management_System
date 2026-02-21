// ClubMembersList.jsx
import React, { useState } from 'react';
import { Users, User, Clock, CheckCircle, Search, Trash2, Crown, ClipboardList } from 'lucide-react';
import { useAuthContext } from '../../context/provider/AuthContext';

const ClubMembersList = ({ clubId, members = [], setMembers, handleRemoveMember, club_role }) => {
  const [search, setSearch] = useState('');
  const { token } = useAuthContext();

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
    switch ((role || 'member').toLowerCase()) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-600 border border-orange-200">
            <Crown className="w-3 h-3" /> Admin
          </span>
        );
      case 'event_handler':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#39D353]/10 text-[#25a83d] border border-[#39D353]/30">
            <ClipboardList className="w-3 h-3" /> Event Handler
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

  const getAvatarGradient = (name = '') => {
    const colors = [
      'from-violet-400 to-purple-500',
      'from-blue-400 to-cyan-500',
      'from-emerald-400 to-teal-500',
      'from-rose-400 to-pink-500',
      'from-amber-400 to-orange-500',
      'from-indigo-400 to-blue-500',
    ];
    return colors[(name.charCodeAt(0) || 0) % colors.length];
  };

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4
        p-5 bg-slate-900 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4">
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
        <div className="px-4 py-2 bg-[#39D353]/10 border border-[#39D353]/25 rounded-xl">
          <span className="text-2xl font-black text-[#39D353]">{members.length}</span>
          <span className="text-xs text-slate-400 ml-1">members</span>
        </div>
      </div>

      {/* ── Search ── */}
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

      {/* ── List ── */}
      <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
        {filtered.length > 0 ? filtered.map((member) => {
          const memberRole = (member.role || 'member').toLowerCase();
          const isAdmin    = memberRole === 'admin';

          return (
            <div
              key={member.user_id}
              className="group flex items-center justify-between gap-3 p-4
                bg-white hover:bg-slate-50 border border-slate-100 hover:border-[#39D353]/30
                rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Avatar + info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-11 h-11 flex-shrink-0 rounded-xl bg-gradient-to-br
                  ${getAvatarGradient(member.name)}
                  flex items-center justify-center shadow-md
                  group-hover:scale-105 transition-transform duration-200`}>
                  <span className="text-base font-black text-white">
                    {member.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
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

              {/* Admin actions — only Remove button, not shown for other admins */}
              {club_role === 'admin' && !isAdmin && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleRemoveMember(member.user_id)}
                    title="Remove member"
                    className="flex items-center gap-1.5 px-3 py-2
                      bg-red-50 hover:bg-red-500 text-red-500 hover:text-white
                      text-xs font-bold rounded-xl border border-red-200 hover:border-red-500
                      shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              )}
            </div>
          );
        }) : (
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