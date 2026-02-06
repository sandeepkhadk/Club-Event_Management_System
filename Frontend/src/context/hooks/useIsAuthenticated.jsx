import { useAuthContext } from "../provider/AuthContext";
 function useIsAuthenticated() {
  const {token}=useAuthContext()
  
  return !!token;
}
export default useIsAuthenticated