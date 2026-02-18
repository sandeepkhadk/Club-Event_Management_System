import { useEffect, useState } from "react";

export default function ApprovedMembers({ clubId, token }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/users/club/${clubId}/approved-members/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok) {
          setMembers(data.members || []);
          setError("");
        } else {
          setError(data.error || "Failed to fetch members");
        }
      } catch (err) {
        setError("Server error: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [clubId, token]);

  if (loading) return <p className="text-gray-500">Loading members...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (members.length === 0) return <p className="text-gray-500">No members found.</p>;

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <div
          key={member.user_id}
          className="flex justify-between items-center p-3 border rounded shadow-sm hover:bg-gray-50 transition"
        >
          <div>
            <p className="font-medium text-gray-800">{member.name}</p>
            <p className="text-sm text-gray-500">Role: {member.role}</p>
          </div>
          <span className="text-green-600 font-semibold">{member.status}</span>
        </div>
      ))}
    </div>
  );
}
