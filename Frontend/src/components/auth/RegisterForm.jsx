// import { useState } from 'react';
// import UserTypeSelector from "./UserTypeSelector";
// import { useNavigate } from 'react-router-dom';

// export default function RegisterForm({ onRegister }) {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [message, setMessage] = useState({ text: '', type: '' });
//   const [userType, setUserType] = useState("student");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       setMessage({ text: 'Passwords do not match.', type: 'error' });
//       return;
//     }

//     if (password.length < 6) {
//       setMessage({ text: 'Password must be at least 6 characters.', type: 'error' });
//       return;
//     }

//     const userData = { email, password, name };

//     const res = await fetch("http://127.0.0.1:8000/users/register/", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(userData),
//     });

//     const data = await res.json();

//     if (data.success) {
//       navigate(userType === "admin" ? "/admin" : "/student", {
//         state: { name },
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center
//                 bg-gradient-to-br from-[#3b3b7a] via-[#5a5fa3] to-[#9169a1] px-4">

//       <div className="w-full max-w-md bg-white backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-6">


//         {/* Header */}
//         <div className="text-center">
//           <h1 className="text-3xl font-bold text-indigo-700">
//             College Club Management
//           </h1>
//           <p className="text-gray-500 mt-2">
//             Create a new account
//           </p>
//         </div>

//         {/* User Type */}
//         <UserTypeSelector
//           userType={userType}
//           onUserTypeChange={setUserType}
//         />

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-5">

//           {/* Full Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Full Name
//             </label>
//             <input
//               type="text"
//               placeholder="Enter your full name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg
//                          focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email Address
//             </label>
//             <input
//               type="email"
//               placeholder={`${userType}@college.edu`}
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg
//                          focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               placeholder="Minimum 6 characters"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg
//                          focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
//             />
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               placeholder="Re-enter your password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg
//                          focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
//             />
//           </div>

//           {/* Message */}
//           {message.text && (
//             <div
//               className={`text-sm text-center p-3 rounded-lg ${
//                 message.type === 'success'
//                   ? 'bg-green-100 text-green-700'
//                   : 'bg-red-100 text-red-700'
//               }`}
//             >
//               {message.text}
//             </div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full py-3 rounded-lg text-white font-semibold
//              bg-indigo-600
//              hover:bg-indigo-700
//              transform hover:-translate-y-1
//              transition duration-300 shadow-lg hover:shadow-xl
//              text-center"
//           >
//             Register as {userType === 'admin' ? 'Admin' : 'Student'}
//           </button>
//         </form>

//         {/* Footer */}
//         <div className="text-center text-sm text-gray-600">
//           Already have an account?
//           <button
//             onClick={() => navigate('/login')}
//             className="ml-1 text-indigo-600 font-medium hover:text-indigo-800"
//           >
//             Login
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }
import { useState } from 'react';
import UserTypeSelector from "./UserTypeSelector";
import { useNavigate } from 'react-router-dom';

export default function RegisterForm({ onRegister }) {
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

    const userData = { email, password, name };

    const res = await fetch("http://127.0.0.1:8000/users/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (data.success) {
      navigate(userType === "admin" ? "/admin" : "/student", {
        state: { name },
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-[#3b3b7a] via-[#5a5fa3] to-[#9169a1] px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6
                      flex flex-col justify-between h-[90vh]">

        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 truncate">
            College Club Management
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base truncate">
            Create a new account
          </p>
        </div>

        {/* User Type */}
        <UserTypeSelector
          userType={userType}
          onUserTypeChange={setUserType}
        />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2 flex-1 flex flex-col justify-between">

          <div className="space-y-2">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder={`${userType}@college.edu`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            {/* Message */}
            {message.text && (
              <div
                className={`text-sm text-center p-2 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {message.text}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-lg text-white font-semibold
                       bg-indigo-600 hover:bg-indigo-700
                       transform hover:-translate-y-1
                       transition duration-300 shadow-lg hover:shadow-xl"
          >
            Register as {userType === 'admin' ? 'Admin' : 'Student'}
          </button>

        </form>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 mt-2">
          Already have an account?
          <button
            onClick={() => navigate('/login')}
            className="ml-1 text-indigo-600 font-medium hover:text-indigo-800"
          >
            Login
          </button>
        </div>

      </div>
    </div>
  );
}
