// PrivateRoute.jsx
// import { Navigate, Outlet } from "react-router-dom";

// export default function PrivateRoute({ isAuth }) {
//   // If user is authenticated, render child routes
//   // Otherwise, redirect to login
//   return isAuth ? <Outlet /> : <Navigate to="/login" />;
// }


import { Navigate, Outlet } from "react-router-dom";
import { useUserRole } from "../../context/hooks/useUserRole";

export default function RoleRoute({ allowedRoles }) {
  const role = useUserRole();
  

  if (!role) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(role)) {
    return  <Navigate
        to="/unauthorized"
        replace
        state={{
          fromProtectedRoute: true,
          message: "You are not allowed to access this page",
        }}
        
      />;
  }

  return <Outlet />;
}