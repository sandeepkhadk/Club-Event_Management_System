// PublicRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { getUserRole } from "./jwtdecoder";

function isAuthenticated() {
  return !!localStorage.getItem("token");
}

export default function PublicRoute() {
  const role = getUserRole();

  if (isAuthenticated()) {
    return (
      <Navigate
        to={role === "admin" ? "/admin" : "/student"}
        replace
      />
    );
  }

  return <Outlet />;
}