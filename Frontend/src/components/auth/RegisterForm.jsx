import { useState } from 'react';
import UserTypeSelector from "./UserTypeSelector";
import { useNavigate } from 'react-router-dom';



export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [userType, setUserType] = useState("student");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match.', type: 'error' });
      return;
    }
    
    if (password.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters.', type: 'error' });
      return;
    }
    
    const userData = { email, password, name, userType };
    const res = await fetch("http://127.0.0.1:8000/users/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    const data = await res.json();
    
    if (data.success) {
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      navigate('/login');
    } else {
      setMessage({ text: data.error || 'Registration failed', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  bg-linear-to-br from-[#3b3b7a] via-[#5a5fa3] to-[#9169a1] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-700 mb-1">College Club Management</h1>
          <p className="text-gray-600 text-sm sm:text-base">Register to access the system</p>
        </div>

        {/* User Type Selector */}
        <UserTypeSelector userType={userType} onUserTypeChange={setUserType} />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Message */}
          {message.text && (
            <div className={`p-2 text-sm rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition shadow"
          >
            Register as {userType === 'Member'}
          </button>

          {/* Login Link */}
          <div className="text-center text-gray-600 text-sm">
            Already have an account?{' '}
            <button type="button" className="text-indigo-600 font-medium hover:text-indigo-800" onClick={() => navigate('/login')}>
              Login
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
