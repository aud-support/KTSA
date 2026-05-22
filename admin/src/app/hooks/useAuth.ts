import { useState, useEffect, createContext, useContext } from "react";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Mock credentials — replace with real API call later
const MOCK_ADMIN = {
  email: "admin@ktsaofficial.in",
  password: "admin123",
  user: {
    id: 1,
    name: "KTSA Admin",
    email: "admin@ktsaofficial.in",
    role: "ADMIN",
  },
};

export function useAuthProvider(): AuthContextType {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    const storedUser = localStorage.getItem("admin_user");
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: replace with real API call
    // const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    await new Promise((res) => setTimeout(res, 600)); // simulate network
    if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
      const mockToken = "mock-jwt-token-ktsa-admin";
      localStorage.setItem("admin_token", mockToken);
      localStorage.setItem("admin_user", JSON.stringify(MOCK_ADMIN.user));
      setToken(mockToken);
      setUser(MOCK_ADMIN.user);
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setToken(null);
    setUser(null);
  };

  return { user, token, login, logout, isLoading };
}
