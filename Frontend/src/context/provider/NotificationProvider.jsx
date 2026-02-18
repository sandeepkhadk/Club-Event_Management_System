import React, { createContext, useState, useContext } from "react";
import Toast from "./Toast";

// Create a context
const NotificationContext = createContext();

// Provider component
export const NotificationProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  // Function to show a toast
  const showToast = (message, type = "info", duration = 3000) => {
    setToast({ message, type });

    // Auto-hide after duration
    setTimeout(() => setToast(null), duration);
  };

  return (
    <NotificationContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </NotificationContext.Provider>
  );
};

// Custom hook for easier usage
export const useNotification = () => useContext(NotificationContext);
