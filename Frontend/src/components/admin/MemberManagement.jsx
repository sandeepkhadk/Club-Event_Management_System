import React, { useState } from 'react';
<<<<<<< Updated upstream
import { Shield, Trash2 } from 'lucide-react';
=======
import { CheckCircle2, XCircle } from 'lucide-react';
>>>>>>> Stashed changes

const MemberManagement = ({ members, token, fetchMembers }) => {
  const [roleSelections, setRoleSelections] = useState({});

  // Decode current user ID from token
  const userId = token
    ? JSON.parse(atob(token.split('.')[1])).user_id
    : null;

  // Filter only pending requests and exclude current user
  const pendingMembers = members.filter(
    member =>
      member.status?.toLowerCase() === 'pending' && member.user_id !== userId
  );

<<<<<<< Updated upstream
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
      fetchMembers();
    } catch (err) {
      console.error(err);
    }
  };

  const approveMember = async (requestId) => {
    
    const role = roleSelections[requestId];
    console.log(role)
    if (!role) return;
=======
  const handleRoleChange = (memberId, role) => {
    setRoleSelections({ ...roleSelections, [memberId]: role });
  };

  const approveMember = async (memberId) => {
    const role = roleSelections[memberId];
    if (!role) return alert('Select a role first!');
>>>>>>> Stashed changes

    try {
      await fetch(`http://127.0.0.1:8000/users/requests/approve/${memberId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ role }),
      });
      fetchMembers();
<<<<<<< Updated upstream
=======
      setRoleSelections(prev => ({ ...prev, [memberId]: '' }));
>>>>>>> Stashed changes
    } catch (err) {
      console.error(err);
    }
  };

  const rejectMember = async (memberId) => {
    try {
<<<<<<< Updated upstream
      await fetch(`http://127.0.0.1:8000/members/${userId}/reject/`, {
        method: "POST",
=======
      await fetch(`http://127.0.0.1:8000/users/reject/${memberId}/`, {
        method: 'POST',
>>>>>>> Stashed changes
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      fetchMembers();
    } catch (err) {
      console.error(err);
    }
  };

<<<<<<< Updated upstream
  const removeMember = async (userId) => {
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

  return (
    <section>
      <h2 className="text-3xl font-extrabold mb-6">Member Requests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleMembers.map((member) => (
          <div
            key={member.user_id + member.status}
            className="bg-white rounded-xl shadow p-5 flex flex-col space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">{member.name}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                member.status.toLowerCase() === "approved" ? "bg-green-100 text-green-800" :
                member.status.toLowerCase() === "pending" ? "bg-yellow-100 text-yellow-800" :
                "bg-gray-100 text-gray-800"
              }`}>
                {member.status}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Shield className="size-4 text-blue-500" />
              <span>{member.role || "No role assigned"}</span>
            </div>

            {/* Role selector + Approve button for pending members */}
            {member.status.toLowerCase() === "pending" && (
              <>
                <select
                  value={roleSelections[member.user_id] || ""}
                  onChange={(e) => handleRoleChange(member.user_id, e.target.value)}
                  className="border rounded p-2 w-full"
=======
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-4">Pending Member Requests</h2>

      {pendingMembers.length === 0 ? (
        <p className="text-gray-500">No pending requests.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingMembers.map(member => (
            <div
              key={member.user_id}
              className="bg-white rounded-xl shadow p-5 flex flex-col space-y-4"
            >
              <div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.email}</p>
              </div>

              <div>
                <select
                  value={roleSelections[member.user_id] || ''}
                  onChange={(e) =>
                    handleRoleChange(member.user_id, e.target.value)
                  }
                  className="w-full border rounded p-2"
>>>>>>> Stashed changes
                >
                  <option value="">Select Role</option>
                  <option value="member">Member</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
<<<<<<< Updated upstream

                <div className="flex justify-between space-x-2">
                  <button
                    onClick={() => approveMember(member.user_id)}  // request ID goes here
                    disabled={!roleSelections[member.user_id]} // role is still mapped by user_id
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectMember(member.user_id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </>
            )}

            {/* Assign role to approved members without role */}
            {member.status.toLowerCase() === "approved" && !member.role && (
              <div className="flex space-x-2 mt-2">
                <select
                  value={roleSelections[member.user_id] || ""}
                  onChange={(e) => handleRoleChange(member.user_id, e.target.value)}
                  className="border rounded p-2 flex-1"
                >
                  <option value="">Select Role</option>
                  <option value="member">Member</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  onClick={() => assignRole(member.user_id)}
                  disabled={!roleSelections[member.user_id]}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Assign
                </button>
              </div>
            )}

            {/* Remove member button */}
            <button
              onClick={() => removeMember(member.user_id)}
              className="mt-2 flex items-center justify-center bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              <Trash2 className="mr-1" /> Remove
            </button>
          </div>
        ))}
      </div>
    </section>
=======
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => approveMember(member.user_id)}
                  disabled={!roleSelections[member.user_id]}
                  className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 /> Approve
                </button>
                <button
                  onClick={() => rejectMember(member.user_id)}
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <XCircle /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
>>>>>>> Stashed changes
  );
};

export default MemberManagement;
