// PrivateRoute.jsx
// import { Navigate, Outlet } from "react-router-dom";

// export default function PrivateRoute({ isAuth }) {
//   // If user is authenticated, render child routes
//   // Otherwise, redirect to login
//   return isAuth ? <Outlet /> : <Navigate to="/login" />;
// }


import { Navigate, Outlet } from "react-router-dom";
import { useUserRole } from "../../context/hooks/useUserRole";
import useIsAuthenticated from "../../context/hooks/useIsAuthenticated";

export default function RoleRoute({ allowedRoles }) {
  const role = useUserRole();
  const isAuthenticated = useIsAuthenticated();

  // 1️⃣ Not logged in → redirect to login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // 2️⃣ Logged in but role not allowed → redirect to unauthorized
  if (!allowedRoles.includes(role)) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{
          fromProtectedRoute: true,
          message: "You are not allowed to access this page",
        }}
      />
    );
  }

  // 3️⃣ Authorized → render nested routes
  return <Outlet />;
}
