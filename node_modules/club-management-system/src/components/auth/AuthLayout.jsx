import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import UserTypeSelector from './UserTypeSelector';
import LoginToggle from './LoginToggle';
// import DemoCredentials from './DemoCredentials';
// import { useAuth } from '../../context/AuthContext';

export default function AuthLayout() {
  // const { isLogin, setIsLogin, userType, setUserType, handleLogin, handleRegister } = useAuth();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">College Club Management</h1>
          <p className="text-gray-600">Login or register to access the system</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <UserTypeSelector userType={userType} onUserTypeChange={setUserType} />
          <LoginToggle isLogin={isLogin} onToggle={setIsLogin} />
          
          <div className="p-8">
            {isLogin ? (
              <LoginForm 
                userType={userType} 
                onLogin={handleLogin} 
                onSwitchToRegister={() => setIsLogin(false)} 
              />
            ) : (
              <RegisterForm 
                userType={userType} 
                onRegister={handleRegister} 
                onSwitchToLogin={() => setIsLogin(true)} 
              />
            )}
          </div>
        </div>
        
        {/* <DemoCredentials /> */}
      </div>
    </div>
  );
}
