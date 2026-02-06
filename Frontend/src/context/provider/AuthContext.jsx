import { createContext, useContext, useState,useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
useEffect(() => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (token && user) {
    setToken(token);
    setUser(user);
  }
}, []);
  const login = (userData, token) => {
   
    setUser(userData);
    setToken(token);
localStorage.setItem("token", token);
localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
