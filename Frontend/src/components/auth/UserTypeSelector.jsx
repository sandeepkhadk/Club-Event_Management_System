export default function UserTypeSelector({ userType, onUserTypeChange }) {
  return (
    <div className="flex border-b">
      <button 
        className={`flex-1 py-4 text-center font-medium ${
          userType === 'student' 
            ? 'bg-indigo-50 text-indigo-600' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onUserTypeChange('student')}
      >
        <i className="fas fa-user-graduate mr-2" /> Student
      </button>
      <button 
        className={`flex-1 py-4 text-center font-medium ${
          userType === 'admin' 
            ? 'bg-indigo-50 text-indigo-600' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onUserTypeChange('admin')}
      >
        <i className="fas fa-user-shield mr-2" /> Admin
      </button>
    </div>
  );
}
