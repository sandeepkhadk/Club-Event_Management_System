import { jwtDecode } from "jwt-decode";  
import { useAuthContext } from "../provider/AuthContext";

export function useUserRole() {
  const { token } = useAuthContext();

  if (!token) return null;

  try {
    const decoded = jwtDecode(token);  
    console.log('useUserRole DECODED:', decoded);
    return decoded;
  } catch {
    console.log('useUserRole DECODE ERROR');
    return null;
  }
}
