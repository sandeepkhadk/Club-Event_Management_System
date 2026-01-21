// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import UserTypeSelector from './UserTypeSelector';

// export default function LoginForm({ onLogin }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState({ text: '', type: '' });
//   const [userType, setUserType] = useState('student');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const result = await onLogin(email, password);
//     setMessage({
//       text: result.message,
//       type: result.success ? 'success' : 'error',
//     });

//     if (result.success) {
//       setTimeout(() => {
//         navigate(userType === 'admin' ? '/admin' : '/student');
//       }, 1000);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center
//                 bg-linear-to-br from-[#3b3b7a] via-[#5a5fa3] to-[#9169a1] px-4">

      
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-fadeIn">

//         {/* Header */}
//         <div className="text-center">
//           <h1 className="text-3xl font-bold text-indigo-700">
//             College Club Management
//           </h1>
//           <p className="text-gray-500 mt-2">
//             Login to access your dashboard
//           </p>
//         </div>

//         {/* User Type */}
//         <UserTypeSelector
//           userType={userType}
//           onUserTypeChange={setUserType}
//         />

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-5">

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
//                          focus:outline-none focus:ring-2 focus:ring-indigo-500 
//                          focus:border-transparent transition"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg 
//                          focus:outline-none focus:ring-2 focus:ring-indigo-500 
//                          focus:border-transparent transition"
//             />
//           </div>

//           {/* Message */}
//           {message.text && (
//             <div
//               className={`text-sm text-center p-3 rounded-lg transition ${
//                 message.type === 'success'
//                   ? 'bg-green-100 text-green-700'
//                   : 'bg-red-100 text-red-700'
//               }`}
//             >
//               {message.text}
//             </div>
//           )}

//           {/* Button */}
//           <button
//             type="submit"
//             className="w-full py-3 rounded-lg text-white font-semibold
//                        bg-linear-to-r from-indigo-600 to-blue-600
//                        hover:from-indigo-700 hover:to-blue-700
//                        transform hover:-translate-y-0.5
//                        transition duration-300 shadow-lg"
//           >
//             Login as {userType === 'admin' ? 'Admin' : 'Student'}
//           </button>
//         </form>

//         {/* Footer */}
//         <div className="text-center text-sm text-gray-600">
//           Don’t have an account?
//           <button
//             onClick={() => navigate('/register')}
//             className="ml-1 text-indigo-600 font-medium hover:text-indigo-800"
//           >
//             Register here
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTypeSelector from './UserTypeSelector';

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [userType, setUserType] = useState('student');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onLogin(email, password);
    setMessage({
      text: result.message,
      type: result.success ? 'success' : 'error',
    });

    if (result.success) {
      setTimeout(() => {
        navigate(userType === 'admin' ? '/admin' : '/student');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
                bg-gradient-to-br from-[#3b3b7a] via-[#5a5fa3] to-[#9169a1] px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-fadeIn">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-700">
            College Club Management
          </h1>
          <p className="text-gray-500 mt-2">
            Login to access your dashboard
          </p>
        </div>

        {/* User Type Selector */}
        <UserTypeSelector
          userType={userType}
          onUserTypeChange={setUserType}
        />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         focus:border-transparent transition shadow-sm hover:shadow-md"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         focus:border-transparent transition shadow-sm hover:shadow-md"
            />
          </div>

          {/* Message */}
          {message.text && (
            <div
              className={`text-sm text-center p-3 rounded-lg transition ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <button type="submit"
            className="w-full py-3 rounded-lg text-white font-semibold
             bg-indigo-600
             hover:bg-indigo-700
             transform hover:-translate-y-1
             transition duration-300 shadow-lg hover:shadow-xl
             text-center"
>
  Login as {userType === 'admin' ? 'Admin' : 'Student'}
</button>


        </form>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          Don’t have an account?
          <button
            onClick={() => navigate('/register')}
            className="ml-1 text-indigo-600 font-medium hover:text-indigo-800"
          >
            Register here
          </button>
        </div>

      </div>
    </div>
  );
}
