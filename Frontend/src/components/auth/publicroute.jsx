// PublicRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import useIsAuthenticated from "../../context/hooks/useIsAuthenticated";
import { useUserRole } from "../../context/hooks/useUserRole";

export default function PublicRoute() {
  const role = useUserRole();

  // Redirect only if the user is authenticated
  if (useIsAuthenticated()) {
    // Logged-in admin → /admin, student → /student
    return <Navigate to={role === "admin" ? "/admin" : "/student"} replace />;
  }

  // Not logged in → allow access to public routes
  return <Outlet />;
}
