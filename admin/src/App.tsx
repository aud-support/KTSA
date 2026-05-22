import { BrowserRouter } from "react-router";
import { AuthContext, useAuthProvider } from "./app/hooks/useAuth";
import AppRoutes from "./app/routes";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
