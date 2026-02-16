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

export default function PrivateRoute() {
  const role = useUserRole();
  console.log(role)
  const isAuthenticated = useIsAuthenticated();

  
  if (!isAuthenticated) return <Navigate to="/login" replace />;


  
  if (!role) {
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


  return <Outlet />;
}
