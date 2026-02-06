import React from "react";
import { Link,useLocation,Navigate } from "react-router-dom";

export default function Unauth() {
  const location =useLocation()
   
  if (!location.state?.fromProtectedRoute) {
    return <Navigate to="/" replace />;
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f8f8f8",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "4rem", color: "#e74c3c" }}>403</h1>
      <h2 style={{ fontSize: "2rem", margin: "10px 0" }}>Access Denied</h2>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        You do not have permission to view this page.
      </p>
      <Link
        to="/"
        style={{
          padding: "10px 20px",
          backgroundColor: "#3498db",
          color: "white",
          borderRadius: "5px",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Go Home
      </Link>
    </div>
  );
}