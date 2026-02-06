// PublicRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import useIsAuthenticated from "../../context/hooks/useIsAuthenticated";
import { useUserRole } from "../../context/hooks/useUserRole";
export default function PublicRoute() {
  const role = useUserRole();

  if (useIsAuthenticated()) {
    return (
      <Navigate
        to={role === "admin" ? "/admin" : "/student"}
        replace
      />
    );
  }

  return <Outlet />;
}