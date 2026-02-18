import React from "react";

const Toast = ({ message, type = "info", onClose }) => {
  const colors = {
    info: "bg-blue-500",
    success: "bg-green-500",
    error: "bg-red-500",
  };

  return (
    <div
      className={`fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white text-sm flex items-center gap-2 ${colors[type]} animate-slideIn`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="font-bold ml-2 text-white">
        ×
      </button>
    </div>
  );
};

export default Toast;
