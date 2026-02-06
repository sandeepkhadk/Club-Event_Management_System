import { AuthProvider } from "./AuthContext";
import { ClubProvider } from "./ClubContext";

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ClubProvider>
        {children}
      </ClubProvider>
    </AuthProvider>
  );
}
