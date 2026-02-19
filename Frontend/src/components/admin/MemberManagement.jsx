import React, { useState } from "react";
import { Shield } from "lucide-react";
import apiUrl from "../../api";

const MemberManagement = ({ members, token, fetchMembers }) => {
  const [roleSelections, setRoleSelections] = useState({});

  // Decode current user id
  const userId = token
    ? JSON.parse(atob(token.split(".")[1])).user_id
    : null;

  // ✅ Show ONLY pending members and exclude current user
  const pendingMembers = members.filter(
    (member) =>
      member.user_id !== userId &&
      member.status?.toLowerCase() === "pending"
  );

  const handleRoleChange = (userId, role) => {
    setRoleSelections({ ...roleSelections, [userId]: role });
  };

  const approveMember = async (requestId) => {
    const role = roleSelections[requestId];
    if (!role) return;

    try {
      await fetch(
        `${apiUrl}users/requests/approve/${requestId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ role }),
        }
      );
      fetchMembers();
    } catch (err) {
      console.error(err);
    }
  };

  const rejectMember = async (userId) => {
    try {
      await fetch(
        `${apiUrl}users/reject/${userId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },

        }
      );
      fetchMembers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section>
      <h2 className="text-3xl font-extrabold mb-6">Pending Member Requests</h2>

      {pendingMembers.length === 0 ? (
        <p className="text-gray-500 italic">
          No pending member requests
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingMembers.map((member) => (
            <div
              key={member.user_id}
              className="bg-white rounded-xl shadow p-5 flex flex-col space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">{member.name}</h3>
                <span className="px-2 py-1 rounded text-sm bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Shield className="size-4 text-blue-500" />
                <span>No role assigned</span>
              </div>

              <select
                value={roleSelections[member.user_id] || ""}
                onChange={(e) =>
                  handleRoleChange(member.user_id, e.target.value)
                }
                className="border rounded p-2 w-full"
              >
                <option value="">Select Role</option>
                <option value="member">Member</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>

              <div className="flex justify-between space-x-2">
                <button
                    onClick={() => approveMember(member.user_id)}
                    disabled={!roleSelections[member.user_id]}
                    className="flex-1 bg-indigo-50 text-indigo-700 border border-indigo-200 py-2 rounded-full font-semibold text-sm hover:bg-indigo-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => rejectMember(member.user_id)}
                    className="flex-1 bg-red-50 text-red-600 border border-red-200 py-2 rounded-full font-semibold text-sm hover:bg-red-100 transition-all"
                  >
                    Reject
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MemberManagement;
