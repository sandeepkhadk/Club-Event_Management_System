// // import React, { useState } from 'react';
// // import { Shield, Trash2 } from 'lucide-react';

// // const MemberManagement = ({ members, token, fetchMembers }) => {
// //   const [roleSelections, setRoleSelections] = useState({});

// //   // Decode user_id from token
// //   const userId = token
// //     ? JSON.parse(atob(token.split('.')[1])).user_id
// //     : null;

// //   // Filter out current user
// //   const visibleMembers = members.filter(member => member.user_id !== userId);

// //   const handleRoleChange = (userId, role) => {
// //     setRoleSelections({ ...roleSelections, [userId]: role });
// //   };

// //   const assignRole = async (userId) => {
// //     const role = roleSelections[userId];
// //     if (!role) return;
// //     try {
// //       await fetch(`http://127.0.0.1:8000/members/${userId}/role/`, {
// //         method: "PATCH",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: token ? `Bearer ${token}` : "",
// //         },
// //         body: JSON.stringify({ role }),
// //       });
// //       fetchMembers();
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   const approveMember = async (requestId) => {
    
// //     const role = roleSelections[requestId];
// //     console.log(role)
// //     if (!role) return;

// //     try {
// //       await fetch(`http://127.0.0.1:8000/users/requests/approve/${requestId}/`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: token ? `Bearer ${token}` : "",
// //         },
// //         body: JSON.stringify({ role }),
// //       });
// //       fetchMembers();
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   const rejectMember = async (userId) => {
// //     try {
// //       await fetch(`http://127.0.0.1:8000/members/${userId}/reject/`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: token ? `Bearer ${token}` : "",
// //         },
// //       });
// //       fetchMembers();
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   const removeMember = async (userId) => {
// //     try {
// //       await fetch(`http://127.0.0.1:8000/users/${userId}/remove/`, {
// //         method: "DELETE",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: token ? `Bearer ${token}` : "",
// //         },
// //       });
// //       fetchMembers();
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   return (
// //     <section>
// //       <h2 className="text-3xl font-extrabold mb-6">Member Requests</h2>
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //         {visibleMembers.map((member) => (
// //           <div
// //             key={member.user_id + member.status}
// //             className="bg-white rounded-xl shadow p-5 flex flex-col space-y-3"
// //           >
// //             <div className="flex items-center justify-between">
// //               <h3 className="font-bold text-lg">{member.name}</h3>
// //               <span className={`px-2 py-1 rounded text-sm ${
// //                 member.status.toLowerCase() === "approved" ? "bg-green-100 text-green-800" :
// //                 member.status.toLowerCase() === "pending" ? "bg-yellow-100 text-yellow-800" :
// //                 "bg-gray-100 text-gray-800"
// //               }`}>
// //                 {member.status}
// //               </span>
// //             </div>

// //             <div className="flex items-center space-x-2">
// //               <Shield className="size-4 text-blue-500" />
// //               <span>{member.role || "No role assigned"}</span>
// //             </div>

// //             {/* Role selector + Approve button for pending members */}
// //             {member.status.toLowerCase() === "pending" && (
// //               <>
// //                 <select
// //                   value={roleSelections[member.user_id] || ""}
// //                   onChange={(e) => handleRoleChange(member.user_id, e.target.value)}
// //                   className="border rounded p-2 w-full"
// //                 >
// //                   <option value="">Select Role</option>
// //                   <option value="member">Member</option>
// //                   <option value="moderator">Moderator</option>
// //                   <option value="admin">Admin</option>
// //                 </select>

// //                 <div className="flex justify-between space-x-2">
// //                   <button
// //                     onClick={() => approveMember(member.user_id)}  // request ID goes here
// //                     disabled={!roleSelections[member.user_id]} // role is still mapped by user_id
// //                     className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
// //                   >
// //                     Approve
// //                   </button>
// //                   <button
// //                     onClick={() => rejectMember(member.user_id)}
// //                     className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
// //                   >
// //                     Reject
// //                   </button>
// //                 </div>
// //               </>
// //             )}

// //             {/* Assign role to approved members without role */}
// //             {member.status.toLowerCase() === "approved" && !member.role && (
// //               <div className="flex space-x-2 mt-2">
// //                 <select
// //                   value={roleSelections[member.user_id] || ""}
// //                   onChange={(e) => handleRoleChange(member.user_id, e.target.value)}
// //                   className="border rounded p-2 flex-1"
// //                 >
// //                   <option value="">Select Role</option>
// //                   <option value="member">Member</option>
// //                   <option value="moderator">Moderator</option>
// //                   <option value="admin">Admin</option>
// //                 </select>
// //                 <button
// //                   onClick={() => assignRole(member.user_id)}
// //                   disabled={!roleSelections[member.user_id]}
// //                   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
// //                 >
// //                   Assign
// //                 </button>
// //               </div>
// //             )}

// //             {/* Remove member button */}
// //             <button
// //               onClick={() => removeMember(member.user_id)}
// //               className="mt-2 flex items-center justify-center bg-red-600 text-white py-2 rounded hover:bg-red-700"
// //             >
// //               <Trash2 className="mr-1" /> Remove
// //             </button>
// //           </div>
// //         ))}
// //       </div>
// //     </section>
// //   );
// // };

// // export default MemberManagement;

// import React, { useState } from 'react';
// import { Shield, Trash2 } from 'lucide-react';

// const MemberManagement = ({ members, token, fetchMembers }) => {
//   const [roleSelections, setRoleSelections] = useState({});

//   // Decode user_id from token
//   const userId = token
//     ? JSON.parse(atob(token.split('.')[1])).user_id
//     : null;

//   // Filter out current user
//   const visibleMembers = members.filter(member => member.user_id !== userId);

//   const handleRoleChange = (userId, role) => {
//     setRoleSelections({ ...roleSelections, [userId]: role });
//   };

//   const assignRole = async (userId) => {
//     const role = roleSelections[userId];
//     if (!role) return;
//     try {
//       await fetch(`http://127.0.0.1:8000/members/${userId}/role/`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//         body: JSON.stringify({ role }),
//       });
//       fetchMembers();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const approveMember = async (requestId) => {
    
//     const role = roleSelections[requestId];
//     console.log(role)
//     if (!role) return;

//     try {
//       await fetch(`http://127.0.0.1:8000/users/requests/approve/${requestId}/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//         body: JSON.stringify({ role }),
//       });
//       fetchMembers();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const rejectMember = async (userId) => {
//     try {
//       await fetch(`http://127.0.0.1:8000/members/${userId}/reject/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//       });
//       fetchMembers();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const removeMember = async (userId) => {
//     try {
//       await fetch(`http://127.0.0.1:8000/users/${userId}/remove/`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//       });
//       fetchMembers();
//     } catch (err) {
//       console.error(err);
//     }
//   };


//   return (
//     <section>
//       <h2 className="text-3xl font-extrabold mb-6">Member Requests</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {visibleMembers.map((member) => (
//           <div
//             key={member.user_id + member.status}
//             className="bg-white rounded-xl shadow p-5 flex flex-col space-y-3"
//           >
//             <div className="flex items-center justify-between">
//               <h3 className="font-bold text-lg">{member.name}</h3>
//               <span className={`px-2 py-1 rounded text-sm ${
//                 member.status.toLowerCase() === "approved" ? "bg-green-100 text-green-800" :
//                 member.status.toLowerCase() === "pending" ? "bg-yellow-100 text-yellow-800" :
//                 "bg-gray-100 text-gray-800"
//               }`}>
//                 {member.status}
//               </span>
//             </div>

//             <div className="flex items-center space-x-2">
//               <Shield className="size-4 text-blue-500" />
//               <span>{member.role || "No role assigned"}</span>
//             </div>

//             {/* Role selector + Approve button for pending members */}
//             {member.status.toLowerCase() === "pending" && (
//               <>
//                 <select
//                   value={roleSelections[member.user_id] || ""}
//                   onChange={(e) => handleRoleChange(member.user_id, e.target.value)}
//                   className="border rounded p-2 w-full"
//                 >
//                   <option value="">Select Role</option>
//                   <option value="member">Member</option>
//                   <option value="moderator">Moderator</option>
//                   <option value="admin">Admin</option>
//                 </select>

//                 <div className="flex justify-between space-x-2">
//                   <button
//                     onClick={() => approveMember(member.user_id)}  // request ID goes here
//                     disabled={!roleSelections[member.user_id]} // role is still mapped by user_id
//                     className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//                   >
//                     Approve
//                   </button>
//                   <button
//                     onClick={() => rejectMember(member.user_id)}
//                     className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
//                   >
//                     Reject
//                   </button>
//                 </div>
//               </>
//             )}

//             {/* Assign role to approved members without role */}
//             {member.status.toLowerCase() === "approved" && !member.role && (
//               <div className="flex space-x-2 mt-2">
//                 <select
//                   value={roleSelections[member.user_id] || ""}
//                   onChange={(e) => handleRoleChange(member.user_id, e.target.value)}
//                   className="border rounded p-2 flex-1"
//                 >
//                   <option value="">Select Role</option>
//                   <option value="member">Member</option>
//                   <option value="moderator">Moderator</option>
//                   <option value="admin">Admin</option>
//                 </select>
//                 <button
//                   onClick={() => assignRole(member.user_id)}
//                   disabled={!roleSelections[member.user_id]}
//                   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                 >
//                   Assign
//                 </button>
//               </div>
//             )}

//             {/* Remove member button */}
//             <button
//               onClick={() => removeMember(member.user_id)}
//               className="mt-2 flex items-center justify-center bg-red-600 text-white py-2 rounded hover:bg-red-700"
//             >
//               <Trash2 className="mr-1" /> Remove
//             </button>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default MemberManagement;



import React, { useState } from 'react';

import { Shield, Trash2, CheckCircle2, XCircle, Crown, Users, Mail, UserPlus } from 'lucide-react';


const MemberManagement = ({ members, token, fetchMembers, clubId }) => {
  const [roleSelections, setRoleSelections] = useState({});

  // Decode user_id from token
  const userId = token
    ? JSON.parse(atob(token.split('.')[1])).user_id
    : null;

  // Filter out current user
  const visibleMembers = members.filter(member => member.user_id !== userId);

  // Total members count
  const totalMembers = members.length;
  const approvedMembers = members.filter(m => m.status?.toLowerCase() === 'approved').length;
  const pendingMembers = members.filter(m => m.status?.toLowerCase() === 'pending').length;

  const handleRoleChange = (userId, role) => {
    setRoleSelections({ ...roleSelections, [userId]: role });
  };

  const assignRole = async (userId) => {
    const role = roleSelections[userId];
    if (!role) return;
    try {
      await fetch(`http://127.0.0.1:8000/members/${userId}/role/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ role }),
      });
      fetchMembers(); // Refresh list
      setRoleSelections(prev => ({ ...prev, [userId]: '' })); // Clear selection
    } catch (err) {
      console.error(err);
    }
  };

  const approveMember = async (requestId) => {
    const role = roleSelections[requestId];
    if (!role) return;

    try {
      await fetch(`http://127.0.0.1:8000/users/requests/approve/${requestId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ role }),
      });
      fetchMembers();
      setRoleSelections(prev => ({ ...prev, [requestId]: '' }));
    } catch (err) {
      console.error(err);
    }
  };

  const rejectMember = async (userId) => {
    try {
      await fetch(`http://127.0.0.1:8000/members/${userId}/reject/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      fetchMembers();
    } catch (err) {
      console.error(err);
    }
  };

  const removeMember = async (userId) => {
    if (!confirm(`Remove ${visibleMembers.find(m => m.user_id === userId)?.name || 'this member'} from club?`)) return;
    
    try {
      await fetch(`http://127.0.0.1:8000/users/${userId}/remove/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      fetchMembers();
    } catch (err) {
      console.error(err);
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-yellow-500/25';
      case 'moderator': return 'bg-gradient-to-r from-purple-400 to-indigo-500 text-white shadow-lg shadow-purple-500/25';
      case 'member': return 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/25';
      default: return 'bg-slate-200 text-slate-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'rejected': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/60 shadow-2xl">
        <div>
          <h2 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            Member Management
          </h2>
          <div className="flex flex-wrap items-center gap-6 text-2xl font-bold text-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-3xl text-emerald-600">{totalMembers}</span>
              <span>Total Members</span>
            </div>
            <div className="h-4 w-4 bg-emerald-500 rounded-full"></div>
            <div className="flex items-center gap-2">
              <span className="text-2xl text-amber-600">{pendingMembers}</span>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl text-emerald-600">{approvedMembers}</span>
              <span>Approved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleMembers.length > 0 ? (
          visibleMembers.map((member) => (
            <div
              key={member.user_id + member.status}
              className="group relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/70 shadow-2xl hover:shadow-3xl hover:shadow-indigo-500/25 hover:-translate-y-2 hover:border-indigo-300/80 transition-all duration-700 overflow-hidden h-full"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/3 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-all duration-1000" />

              {/* Avatar & Header */}
              <div className="relative z-10 flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white/50 group-hover:scale-105 transition-all duration-500">
                    <span className="text-3xl font-black text-indigo-700">
                      {member.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-700 transition-colors">
                      {member.name || 'Unknown User'}
                    </h3>
                    <p className="text-lg text-slate-600">{member.email}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <span className={`px-4 py-2 rounded-2xl font-bold uppercase tracking-wider text-sm border-2 inline-flex items-center gap-1 ${getStatusColor(member.status)}`}>
                  {member.status || 'Unknown'}
                </span>
              </div>

              {/* Role Display & Management */}
              <div className="relative z-10 space-y-4 mb-8">
                <div className={`w-full p-4 rounded-2xl text-center font-bold text-lg ${getRoleColor(member.role || member.club_role)}`}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Shield className="w-6 h-6" />
                    <span>{member.role || member.club_role || 'No Role'}</span>
                  </div>
                  <span className="text-sm opacity-90 font-mono uppercase tracking-wider">
                    {member.role || member.club_role || 'Unassigned'}
                  </span>
                </div>

                {/* Role Selector for Pending/Approved without role */}
                {(member.status?.toLowerCase() === 'pending' || 
                  (member.status?.toLowerCase() === 'approved' && !member.role && !member.club_role)) && (
                  <div className="bg-gradient-to-r from-slate-50 to-indigo-50 p-4 rounded-2xl border-2 border-slate-200/50">
                    <select
                      value={roleSelections[member.user_id] || ""}
                      onChange={(e) => handleRoleChange(member.user_id, e.target.value)}
                      className="w-full p-4 border-2 border-slate-200/60 rounded-2xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 bg-white/70 backdrop-blur-xl transition-all duration-400 text-lg font-semibold text-slate-900"
                    >
                      <option value="">Assign Role</option>
                      <option value="member">Member</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="relative z-10 space-y-3 pt-6 border-t-2 border-slate-200/50">
                {/* Pending Members: Approve/Reject */}
                {member.status?.toLowerCase() === 'pending' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => approveMember(member.user_id)}
                      disabled={!roleSelections[member.user_id]}
                      className="group relative py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black text-lg uppercase tracking-wider shadow-2xl hover:shadow-emerald-500/40 hover:shadow-3xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden flex items-center justify-center gap-2"
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-2xl blur" />
                      <CheckCircle2 className="w-6 h-6 group-hover:scale-110" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => rejectMember(member.user_id)}
                      className="group relative py-4 px-6 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-2xl font-black text-lg uppercase tracking-wider shadow-2xl hover:shadow-rose-500/40 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex items-center justify-center gap-2"
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-2xl blur" />
                      <XCircle className="w-6 h-6 group-hover:scale-110" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}

                {/* Approved without role: Assign Role */}
                {member.status?.toLowerCase() === 'approved' && !member.role && !member.club_role && (
                  <button
                    onClick={() => assignRole(member.user_id)}
                    disabled={!roleSelections[member.user_id]}
                    className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-black text-lg uppercase tracking-wider shadow-2xl hover:shadow-indigo-500/40 hover:shadow-3xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <Crown className="w-6 h-6" />
                    Assign Role
                  </button>
                )}

                {/* Remove Button (always visible) */}
                <button
                  onClick={() => removeMember(member.user_id)}
                  className="w-full group relative py-3 px-6 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-2xl font-bold text-lg uppercase tracking-wider shadow-xl hover:shadow-slate-500/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex items-center justify-center gap-2"
                >
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur" />
                  <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Remove Member</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-24 bg-white/60 backdrop-blur-xl rounded-3xl border-2 border-dashed border-slate-200/60">
            <Users className="w-32 h-32 text-slate-300 mx-auto mb-8" />
            <h3 className="text-4xl font-black text-slate-500 mb-4">No Members Yet</h3>
            <p className="text-xl text-slate-500 mb-8 max-w-2xl mx-auto">
              Your club has no members. Approve pending requests or invite new members to get started.
            </p>
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl font-bold text-xl shadow-2xl hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all duration-300">
              <UserPlus className="w-6 h-6" />
              Invite First Member
            </div>
          </div>
        )}
      </div>

      {/* Live Stats Bar */}
      {visibleMembers.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-gradient-to-r from-slate-900/10 to-indigo-900/10 backdrop-blur-xl rounded-4xl border border-indigo-200/50 shadow-2xl">
          <div className="text-center">
            <div className="text-4xl font-black bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-2">
              {members.filter(m => (m.role || m.club_role) === 'admin').length}
            </div>
            <div className="text-lg font-bold text-slate-700 uppercase tracking-wider">Admins</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent mb-2">
              {members.filter(m => (m.role || m.club_role) === 'moderator').length}
            </div>
            <div className="text-lg font-bold text-slate-700 uppercase tracking-wider">Moderators</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-2">
              {members.filter(m => (m.role || m.club_role) === 'member').length}
            </div>
            <div className="text-lg font-bold text-slate-700 uppercase tracking-wider">Members</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
              {totalMembers}
            </div>
            <div className="text-lg font-bold text-slate-700 uppercase tracking-wider">Total</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;
