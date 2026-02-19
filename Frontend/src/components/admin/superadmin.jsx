// import { useState, useEffect } from "react";
// import { useAuthContext } from "../../context/provider/AuthContext";

// export default function SuperAdminPage({ superAdminId }) {
//   const {token}=useAuthContext()
//   console.log(token)
//   const [clubs, setClubs] = useState([]);
//   const [clubName, setClubName] = useState("");
//   const [description, setDescription] = useState("");
//   const [foundedDate, setFoundedDate] = useState("");

//   const CLUB_API = "http://localhost:8000/clubs/";

//   useEffect(() => {
//     fetchClubs();
//   }, []);

//   const fetchClubs = async () => {
//     try {
//       const res = await fetch(CLUB_API);
//       const data = await res.json();
//       if (data.clubs && Array.isArray(data.clubs)) setClubs(data.clubs);
//       else setClubs([]);
//     } catch (err) {
//       console.error("Failed to fetch clubs:", err);
//       setClubs([]);
//     }
//   };

//   const createClub = async () => {
//     if (!clubName) return alert("Enter club name");

//     const payload = {
//       club_name: clubName,
//       admin: superAdminId, // Assign SuperAdmin as temporary admin
//       description: description || null,
//       founded_date: foundedDate || null,
//     };

//     try {
//       const res = await fetch("http://localhost:8000/clubs/create/", {
//         method: "POST",
//      headers: {
//     "Content-Type": "application/json",
//     "Authorization": `Bearer ${token}`, // send JWT
//   },
//         body: JSON.stringify(payload),
//       });

//       if (res.ok) {
//         setClubName("");
//         setDescription("");
//         setFoundedDate("");
//         fetchClubs();
//       }
//     } catch (err) {
//       console.error("Failed to create club:", err);
//     }
//   };

//   const deleteClub = async (id) => {
//     if (!confirm("Are you sure you want to delete this club?")) return;
//     try {
//       const res = await fetch(`${CLUB_API}${id}/`, { method: "DELETE" });
//       if (res.ok) setClubs(clubs.filter((c) => c.club_id !== id));
//     } catch (err) {
//       console.error("Failed to delete club:", err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
//       <div className="w-full max-w-3xl">
//         <h1 className="text-3xl font-bold text-center mb-6">
//           Super Admin Club Panel
//         </h1>

//         {/* Create Club */}
//         <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
//           <h2 className="text-xl font-semibold mb-4">Create Club</h2>
//           <input
//             className="w-full border p-2 rounded mb-3"
//             placeholder="Club name"
//             value={clubName}
//             onChange={(e) => setClubName(e.target.value)}
//           />
//           <input
//             className="w-full border p-2 rounded mb-3"
//             placeholder="Description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//           <input
//             type="date"
//             className="w-full border p-2 rounded mb-3"
//             placeholder="Founded Date"
//             value={foundedDate}
//             onChange={(e) => setFoundedDate(e.target.value)}
//           />
//           <button
//             onClick={createClub}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             Create Club
//           </button>
//         </div>

//         {/* All Clubs */}
//         <div className="bg-white p-6 rounded-2xl shadow-md">
//           <h2 className="text-xl font-semibold mb-4">All Clubs</h2>
//           {Array.isArray(clubs) && clubs.length === 0 && (
//             <p className="text-gray-500 text-center">No clubs available.</p>
//           )}

//           {Array.isArray(clubs) &&
//             clubs.map((club) => (
//               <div
//                 key={club.club_id}
//                 className="flex flex-col md:flex-row justify-between items-start md:items-center border-b py-4"
//               >
//                 <div className="flex-1 mb-3 md:mb-0">
//                   <p className="font-bold text-lg">{club.club_name}</p>
//                   <p className="text-sm text-gray-500">
//                     Founded:{" "}
//                     {club.founded_date
//                       ? new Date(club.founded_date).toLocaleDateString()
//                       : "N/A"}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     Description: {club.description || "No description"}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     Admin: {club.admin_name || "SuperAdmin (temporary)"}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => deleteClub(club.club_id)}
//                   className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//                 >
//                   Delete
//                 </button>
//               </div>
//             ))}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { useAuthContext } from "../../context/provider/AuthContext";
import { useUserRole } from "../../context/hooks/useUserRole";
import { useNavigate } from "react-router-dom";
import { 
  Plus,
  Edit2,
  Trash2,
  UserPlus,
  Building2,
  Calendar,
  Mail,
  LogOut,
  Loader2,
  Users
} from "lucide-react";

export default function SuperAdminPage({ superAdminId }) {
  const navigate=useNavigate()
  const { token, logout } = useAuthContext();
  const [clubs, setClubs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const decoded = useUserRole();
  
  // SHARED FORM STATES (used for BOTH Create + Edit)
  const [formMode, setFormMode] = useState("create"); // "create" | "edit"
  const [formClubId, setFormClubId] = useState(null);
  const [clubName, setClubName] = useState("");
  const [description, setDescription] = useState("");
  const [foundedDate, setFoundedDate] = useState("");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");

  const CLUB_API = "http://localhost:8000/clubs/";
  const USER_API = "http://localhost:8000/users/list/";

  // Initial load
  useEffect(() => {
    if (!token) return;
    const loadData = async () => {
      await Promise.all([fetchClubs(), fetchUsers()]);
    };
    loadData();
  }, []);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const res = await fetch(CLUB_API, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) return logout();
      if (res.status === 403) return setClubs([]);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setClubs(Array.isArray(data.clubs) ? data.clubs : []);
    } catch (err) {
      console.error("Failed to fetch clubs:", err);
      setClubs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const res = await fetch(USER_API, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) return logout();
      if (res.status === 403) return setUsers([]);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const userList = Array.isArray(data.users) 
        ? data.users.map(user => ({ email: user.email, name: user.name || 'No name' }))
        : [];
      setUsers(userList);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
    }
  };

  // SHARED SUBMIT FUNCTION
  const submitClub = async () => {
    if (!clubName || !selectedUserEmail) {
      alert("Club name and admin email required");
      return;
    }
    setLoading(true);
    try {
      const endpoint = formMode === "edit" 
        ? `${CLUB_API}${formClubId}/update/`
        : `${CLUB_API}create/`;
      const method = formMode === "edit" ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          club_name: clubName,
          admin_email: selectedUserEmail,
          description: description || null,
          founded_date: foundedDate || null,
        }),
      });

      if (res.status === 401) return logout();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      resetForm();
      fetchClubs();
      alert(formMode === "edit" ? "Club updated!" : "Club created!");
    } catch (err) {
      alert(`Failed to ${formMode} club: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormMode("create");
    setFormClubId(null);
    setClubName("");
    setDescription("");
    setFoundedDate("");
    setSelectedUserEmail("");
  };

  // START EDIT - scroll to top
  const startEdit = (club) => {
    setFormMode("edit");
    setFormClubId(club.club_id);
    setClubName(club.club_name);
    setDescription(club.description || "");
    setFoundedDate(club.founded_date ? club.founded_date.split('T')[0] : "");
    setSelectedUserEmail(club.admin_email || "");

    // ✅ Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => resetForm();

  const deleteClub = async (clubId) => {
    const clubToDelete = clubs.find(c => c.club_id === clubId);
    if (!clubToDelete) return;
    const userConfirmed = window.confirm(`Permanently delete "${clubToDelete.club_name}"?`);
    if (!userConfirmed) return;

    const originalClubs = [...clubs];
    setClubs(prev => prev.filter(c => c.club_id !== clubId));

    try {
      const res = await fetch(`${CLUB_API}${clubId}/delete/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) return logout();
      if (!res.ok) throw new Error(`Server Error (${res.status})`);
    } catch (err) {
      console.error("Failed to delete club:", err);
      setClubs(originalClubs);
      alert(`Failed to delete club: ${err.message}`);
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
     navigate("/")
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-8">
          <LogOut className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Please log in</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <Building2 className="h-12 w-12 text-indigo-600" />
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Super Admin Panel
            </h1>
            <p className="text-sm text-gray-600">Manage clubs & users ({clubs.length})</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-2xl hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all"
        >
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </div>

      {/* SHARED FORM */}
      <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 mb-10">
        <div className="flex items-center gap-3 mb-8">
          {formMode === "create" ? (
            <Plus className="h-8 w-8 text-emerald-600 bg-emerald-100 p-2 rounded-2xl" />
          ) : (
            <Edit2 className="h-8 w-8 text-blue-600 bg-blue-100 p-2 rounded-2xl" />
          )}
          <h2 className="text-2xl font-bold text-gray-800">
            {formMode === "create" ? "Create New Club" : "Edit Club"}
          </h2>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Club Name</label>
            <input
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50"
              placeholder="Enter club name"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Mail className="h-4 w-4" /> Admin Email
            </label>
            <select
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50"
              value={selectedUserEmail}
              onChange={(e) => setSelectedUserEmail(e.target.value)}
            >
              <option value="">Select registered user</option>
              {users.map((user, index) => (
                <option key={`${user.email}-${index}`} value={user.email}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
            <textarea
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 min-h-[100px]"
              placeholder="Club description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Founded Date
            </label>
            <input
              type="date"
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50"
              value={foundedDate}
              onChange={(e) => setFoundedDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={submitClub}
            disabled={loading || !clubName || !selectedUserEmail}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 px-8 rounded-2xl font-semibold hover:from-emerald-600 hover:to-emerald-700 shadow-xl flex items-center gap-3 disabled:opacity-50 justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {formMode === "edit" ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                {formMode === "edit" ? "Update Club" : "Create Club"}
              </>
            )}
          </button>
          {formMode === "edit" && (
            <button
              onClick={cancelEdit}
              className="px-8 py-4 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 font-semibold flex items-center gap-2 shadow-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50">
        <div className="flex items-center gap-3 mb-8">
          <Users className="h-8 w-8 text-indigo-600 bg-indigo-100 p-2 rounded-2xl" />
          <h2 className="text-2xl font-bold text-gray-800">All Clubs ({clubs.length})</h2>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          </div>
        ) : clubs.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No clubs yet</h3>
            <p className="text-gray-500 mb-8">Create your first club above!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <div
                key={club.club_id}
                className="group bg-gradient-to-br from-white to-gray-50/50 p-6 rounded-2xl border-2 border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-indigo-100 rounded-xl group-hover:bg-indigo-200 transition-all">
                    <Building2 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 ml-3 truncate flex-1">
                    {club.club_name}
                  </h3>
                </div>
                
                <div className="mb-4 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-800">
                    <Mail className="h-4 w-4" />
                    <span>Admin:</span>
                    <span className="font-semibold bg-emerald-100 px-2 py-1 rounded-full text-xs">
                      {club.members_names?.[0] || club.created_by_name || club.admin_name || 'Club Admin'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>
                    {club.founded_date || club.created_date
                      ? new Date(club.founded_date || club.created_date).toLocaleDateString('en-US', { 
                          year: 'numeric', month: 'long', day: 'numeric' 
                        })
                      : "Not specified"}
                  </span>
                </div>
                
                <p className="text-gray-700 leading-relaxed text-sm bg-gray-50 p-3 rounded-xl mb-4">
                  {club.description || "No description available."}
                </p>
                
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => startEdit(club)}
                    className="flex-1 bg-indigo-500 text-white py-2 px-4 rounded-xl hover:bg-indigo-600 flex items-center justify-center gap-1 transition-all"
                    title="Edit club"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteClub(club.club_id)}
                    disabled={loading}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                    title="Delete club"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
