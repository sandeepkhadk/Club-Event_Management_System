import { jwtDecode } from "jwt-decode";  // 🔥 NAMED EXPORT
import { useAuthContext } from "../provider/AuthContext";

export function useUserRole() {
  const { token } = useAuthContext();

  if (!token) return null;

  try {
    const decoded = jwtDecode(token);  // 🔥 jwtDecode (named)
    console.log('useUserRole DECODED:', decoded);
    return decoded;
  } catch {
    console.log('useUserRole DECODE ERROR');
    return null;
  }
}
