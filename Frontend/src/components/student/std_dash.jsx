import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Std_dash() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🚫 No token → go to login
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/users/profile/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        // 🔴 Token expired / invalid
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          throw new Error("Session expired");
        }

        if (!res.ok) {
          throw new Error("Something went wrong");
        }

        return res.json();
      })
      .then((data) => {
        setProfile(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [navigate]);

  // 🔘 Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (error) return <p>{error}</p>;
  if (!profile) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center  bg-gradient-to-br from-[#3b3b7a] via-[#5a5fa3] to-[#9169a1] px-4">
    <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Profile</h2>

      <p className="text-gray-700 mb-3">
        <span className="font-semibold">Name:</span> {profile.name}
      </p>
      <p className="text-gray-700 mb-3">
        <span className="font-semibold">Email:</span> {profile.email}
      </p>
      <p className="text-gray-700 mb-6">
        <span className="font-semibold">Role:</span> {profile.role}
      </p>

      <button
        onClick={handleLogout}
        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  </div>

  );
}