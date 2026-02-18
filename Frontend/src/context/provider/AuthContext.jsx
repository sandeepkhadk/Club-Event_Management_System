// import { createContext, useContext, useState,useEffect } from "react";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
 
//   const [token, setToken] = useState(null);
// useEffect(() => {
//   const token = localStorage.getItem("token");
 

//   if (token ) {
//     setToken(token);
    
//   }
// }, []);
//   const login = (token) => {
//     setToken(token);
// localStorage.setItem("token", token);
// ;
//   };

//   const logout = () => {
   
//     setToken(null);
//   localStorage.removeItem("token");
 
//   };

//   return (
//     <AuthContext.Provider value={{token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuthContext = () => useContext(AuthContext);

import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";  // 🔥 NAMED EXPORT (not default)

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);  // 🔥 jwtDecode (named)
        setToken(savedToken);
        setUser(decoded);
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
    
    try {
      const decoded = jwtDecode(token);  // 🔥 jwtDecode (named)
      setUser(decoded);
    } catch (error) {
      console.error('JWT decode error:', error);
      setUser(null);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
