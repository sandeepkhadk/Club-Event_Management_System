import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import UserTypeSelector from './UserTypeSelector';
import { useAuthContext } from "../../context/provider/AuthContext";
import Navbar from '../home/navbar';
import { useUserRole } from '../../context/hooks/useUserRole';

export default function LoginForm() {
  const { login, token } = useAuthContext();
  const decoded = useUserRole();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [userType, setUserType] = useState("unmember");
  const [loading, setLoading] = useState(true);

  // Redirect if already logged in
  useEffect(() => {
    if (loading) setLoading(false); // Done initializing

    if (!decoded) return; // Not logged in

    // Already logged in → redirect
    if (decoded.global_role === "admin") navigate("/admin");
    else if (decoded.global_role === "member") navigate(`/student/${decoded.club_id}`);
    else navigate("/student");
  }, [decoded, navigate, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:8000/users/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, userType }),
    });

    const data = await res.json();

    if (!data.success) {
      setMessage({ text: data.message || "Invalid email or password", type: "error" });
      return;
    }

    login(data.token);  // just login → redirect happens automatically in useEffect

    setMessage({ text: data.message || "Login successful", type: "success" });
  };

  if (loading) return null; // prevent flashes on logout / refresh

  return (
    <>
      <Navbar/>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3b3b7a] via-[#5a5fa3] to-[#9169a1] px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-indigo-700 mb-1">College Club Management</h1>
            <p className="text-gray-600 text-sm sm:text-base">Login to access your dashboard</p>
          </div>

          <UserTypeSelector userType={userType} onUserTypeChange={setUserType} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder={`${userType}@college.edu`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {message.text && (
              <div className={`p-2 text-sm rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition shadow-lg transform hover:-translate-y-1 duration-300 cursor-pointer"
            >
              Login as {userType === 'admin' ? 'Admin' : 'members'}
            </button>

            <div className="text-center text-gray-600 text-sm mt-2">
              Don't have an account?{' '}
              <button
                type="button"
                className="text-indigo-600 font-medium hover:text-indigo-800"
                onClick={() => navigate('/register')}
              >
                Register here
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

