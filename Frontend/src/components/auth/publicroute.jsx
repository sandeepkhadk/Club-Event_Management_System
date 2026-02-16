
import { Navigate, Outlet } from "react-router-dom";
import useIsAuthenticated from "../../context/hooks/useIsAuthenticated";
import { useUserRole } from "../../context/hooks/useUserRole";

export default function PublicRoute() {
  const decoded = useUserRole();          
  const isAuth = useIsAuthenticated();


  if (!isAuth || !decoded) {
    return <Outlet />;
  }

  const role = decoded.global_role;
  const clubId = decoded.club_id;

  console.log("Role:", role);

 
  if (role === "admin") return <Navigate to="/admin" replace />;
  if (role === "member" && clubId)
    return <Navigate to={`/student/${clubId}`} replace />;
  if (role === "unmember")
    return <Navigate to="/student" replace />;

  return <Navigate to="/" replace />;
}