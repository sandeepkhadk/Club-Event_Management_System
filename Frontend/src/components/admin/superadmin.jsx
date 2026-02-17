import { useState, useEffect } from "react";
import { useAuthContext } from "../../context/provider/AuthContext";

export default function SuperAdminPage({ superAdminId }) {
  const {token,logout}=useAuthContext()
  console.log(token)
  const [clubs, setClubs] = useState([]);
  const [clubName, setClubName] = useState("");
  const [description, setDescription] = useState("");
  const [foundedDate, setFoundedDate] = useState("");

  const CLUB_API = "http://localhost:8000/clubs/";

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const res = await fetch(CLUB_API);
      const data = await res.json();
      if (data.clubs && Array.isArray(data.clubs)) setClubs(data.clubs);
      else setClubs([]);
    } catch (err) {
      console.error("Failed to fetch clubs:", err);
      setClubs([]);
    }
  };

  const createClub = async () => {
    if (!clubName) return alert("Enter club name");

    const payload = {
      club_name: clubName,
      admin: superAdminId, // Assign SuperAdmin as temporary admin
      description: description || null,
      founded_date: foundedDate || null,
    };

    try {
      const res = await fetch("http://localhost:8000/clubs/create/", {
        method: "POST",
     headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`, // send JWT
  },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setClubName("");
        setDescription("");
        setFoundedDate("");
        fetchClubs();
      }
    } catch (err) {
      console.error("Failed to create club:", err);
    }
  };

  const deleteClub = async (id) => {
    if (!confirm("Are you sure you want to delete this club?")) return;
    try {
      const res = await fetch(`${CLUB_API}${id}/`, { method: "DELETE" });
      if (res.ok) setClubs(clubs.filter((c) => c.club_id !== id));
    } catch (err) {
      console.error("Failed to delete club:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-6">
          Super Admin Club Panel
        </h1>

        {/* Create Club */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Create Club</h2>
          <input
            className="w-full border p-2 rounded mb-3"
            placeholder="Club name"
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
          />
          <input
            className="w-full border p-2 rounded mb-3"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="date"
            className="w-full border p-2 rounded mb-3"
            placeholder="Founded Date"
            value={foundedDate}
            onChange={(e) => setFoundedDate(e.target.value)}
          />
          <button
            onClick={createClub}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Club
          </button>
        </div>

        {/* All Clubs */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">All Clubs</h2>
          {Array.isArray(clubs) && clubs.length === 0 && (
            <p className="text-gray-500 text-center">No clubs available.</p>
          )}

          {Array.isArray(clubs) &&
            clubs.map((club) => (
              <div
                key={club.club_id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center border-b py-4"
              >
                <div className="flex-1 mb-3 md:mb-0">
                  <p className="font-bold text-lg">{club.club_name}</p>
                  <p className="text-sm text-gray-500">
                    Founded:{" "}
                    {club.founded_date
                      ? new Date(club.founded_date).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Description: {club.description || "No description"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Admin: {club.admin_name || "SuperAdmin (temporary)"}
                  </p>
                </div>
                <button
                  onClick={() => deleteClub(club.club_id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      </div>
      <button onClick={()=>logout()}>logout</button>
    </div>
  );
}
