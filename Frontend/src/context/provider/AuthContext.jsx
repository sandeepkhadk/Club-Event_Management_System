import { createContext, useContext, useState,useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
 
  const [token, setToken] = useState(null);
useEffect(() => {
  const token = localStorage.getItem("token");
 

  if (token ) {
    setToken(token);
    
  }
}, []);
  const login = (token) => {
    setToken(token);
localStorage.setItem("token", token);
;
  };

  const logout = () => {
   
    setToken(null);
  localStorage.removeItem("token");
 
  };

  return (
    <AuthContext.Provider value={{token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
