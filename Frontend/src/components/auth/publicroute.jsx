import { Navigate, Outlet } from "react-router-dom";
import useIsAuthenticated from "../../context/hooks/useIsAuthenticated";
import { useUserRole } from "../../context/hooks/useUserRole";

export default function PublicRoute() {  // ← FUNCTION START
  
  const decoded = useUserRole();          
  const isAuth = useIsAuthenticated();

  // 1. NOT LOGGED IN → Show public pages
  if (!isAuth || !decoded) {
    return <Outlet />;
  }

  // 2. LOGGED IN → Check role
  const role = decoded?.global_role;
  const clubId = decoded?.club_id;
  const currentPath = window.location.pathname;

  console.log("🔍 PublicRoute - Role:", role, "Path:", currentPath);

  // 3. AVOID SELF-REDIRECTS
  const shouldRedirect = () => {
    if (role === "superadmin" && currentPath === "/admin") return false;
    if (role === "member" && clubId && currentPath === `/student/${clubId}`) return false;
    if (role === "unmember" && currentPath === "/student") return false;
    if (role === "club_admin" && clubId && currentPath === `/clubs/${clubId}/admin`) return false;
    return true;
  };
//REDIRECT LOGGED-IN USERS - CLUB ADMIN FIRST
if (shouldRedirect()) {
  // 🔥 CLUB ADMIN CHECK (NEW!)
  const clubRoles = decoded?.club_roles;
  if (clubRoles) {
    const adminClubId = Object.keys(clubRoles).find(
      id => clubRoles[id] === 'admin'
    );
    if (adminClubId && currentPath !== `/clubs/${adminClubId}/admin`) {
      console.log(`🔍 Club Admin → /clubs/${adminClubId}/admin`);
      return <Navigate to={`/clubs/${adminClubId}/admin`} replace />;
    }
  }

    if (role === "superadmin") {
      return <Navigate to="/admin" replace />;  // SUPERADMIN TO /admin
    }
    
    if (role === "member" && clubId) {
      return <Navigate to={`/student/${clubId}`} replace />;
    }
    
    if (role === "unmember") {
      return <Navigate to="/student" replace />;
    }
  }

  // 5. EVERYTHING ELSE → Show public page
  return <Outlet />; 
} 