import { AuthProvider } from "./AuthContext";
import { ClubProvider } from "./ClubContext";
import { NotificationProvider } from "./NotificationProvider";

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <NotificationProvider>

      <ClubProvider>
        {children}
      </ClubProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
