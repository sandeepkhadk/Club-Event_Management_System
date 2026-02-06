export default function LoginToggle({ isLogin, onToggle }) {
  return (
    <div className="flex border-b">
      <button 
        className={`flex-1 py-4 text-center font-medium ${
          isLogin 
            ? 'text-indigo-600 border-b-2 border-indigo-600' 
            : 'text-gray-500'
        }`}
        onClick={() => onToggle(true)}
      >
        Login
      </button>
      <button 
        className={`flex-1 py-4 text-center font-medium ${
          !isLogin 
            ? 'text-indigo-600 border-b-2 border-indigo-600' 
            : 'text-gray-500'
        }`}
        onClick={() => onToggle(false)}
      >
        Register
      </button>
    </div>
  );
}
