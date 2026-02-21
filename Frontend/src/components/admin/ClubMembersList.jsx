// ClubMembersList.jsx
import React from 'react';
import { Users, User, Shield, Clock, CheckCircle } from 'lucide-react';

const ClubMembersList = ({ members = [], handleRemoveMember }) => {

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-amber-400" />;
      default: return <User className="w-4 h-4 text-slate-400" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-gradient-to-r from-yellow-200/30 to-orange-300/30 text-yellow-600 border-yellow-300/50';
      case 'moderator': return 'bg-gradient-to-r from-purple-400/20 to-indigo-500/20 text-purple-300 border-purple-400/30';
      case 'member': return 'bg-emerald-100/50 text-emerald-300 border-emerald-400/30';
      default: return 'bg-slate-100/30 text-slate-300 border-slate-700/30';
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between p-5 
        bg-gradient-to-r from-indigo-500/10 to-cyan-400/10 
        backdrop-blur-md rounded-2xl border border-indigo-200/40 shadow-md">

        <div className="flex items-center gap-4">
          <Users className="w-7 h-7 text-indigo-500" />
          <div>
            <h2 className="text-xl font-black text-slate-800">Club Members</h2>
            <p className="text-sm text-slate-500">{members.length} total members</p>
          </div>
        </div>

        <div className="text-sm font-bold text-indigo-600">
          {members.filter(m => m.status?.toLowerCase() === 'approved').length} Approved
        </div>
      </div>

      {/* Members List */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {members.length > 0 ? (
          members.map(member => (
            <div
              key={member.user_id}
              className="group flex items-center justify-between p-4
                bg-gradient-to-br from-pink-50/80 to-purple-100/70
                hover:from-pink-100/80 hover:to-purple-200/70
                backdrop-blur-md rounded-xl
                border border-pink-200/60
                hover:border-purple-300
                shadow-sm hover:shadow-md
                transition-all duration-300"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">

                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-300 to-blue-400 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-yellow-400/40 transition-all duration-300">
                  <span className="text-lg font-black text-white">
                    {member.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>

                {/* Member Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-800 truncate max-w-[180px]">
                      {member.name || 'Unknown User'}
                    </span>
                    {getStatusIcon(member.status)}
                  </div>

                  {member.role && (
                    <div className={`px-3 py-1 rounded-lg text-xs font-bold border inline-flex items-center gap-1 ${getRoleColor(member.role)}`}>
                      <Shield className="w-3 h-3" />
                      <span>{member.role}</span>
                    </div>
                  )}
                </div>
              </div>

               {/* Remove Button - Only visible if logged-in user is admin AND member is not admin */}
                {currentUser?.club_role === 'admin' && member.role !== 'admin' && (
                  <button
                    onClick={() => handleRemoveMember(member.user_id)}
                    className="ml-4 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Remove
                  </button>
                
                )}
                </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gradient-to-br from-teal-50/70 to-cyan-50/70 rounded-xl border-2 border-dashed border-teal-200/50">
            <Users className="w-16 h-16 text-teal-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-2">No Members Yet</h3>
            <p className="text-sm text-slate-500">
              Approve pending requests to add members.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubMembersList;