import { jwtDecode } from "jwt-decode";
import { useAuthContext } from "../provider/AuthContext";

export function useUserRole() {
  const { token } = useAuthContext();

  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role;
  } catch {
    return null;
  }
}