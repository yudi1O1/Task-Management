"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../lib/api";
import { User } from "../lib/types";

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<string>;
  register: (name: string, email: string, password: string) => Promise<string>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function restoreSession() {
    try {
      const response = await refreshAccessToken();
      setUser(response.user);
      setAccessToken(response.accessToken);
      return response.accessToken;
    } catch (error) {
      setUser(null);
      setAccessToken(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void restoreSession();
  }, []);

  async function login(email: string, password: string) {
    const response = await loginUser({ email, password });
    setUser(response.user);
    setAccessToken(response.accessToken);
    return response.message;
  }

  async function register(name: string, email: string, password: string) {
    const response = await registerUser({ name, email, password });
    setUser(response.user);
    setAccessToken(response.accessToken);
    return response.message;
  }

  async function logout() {
    await logoutUser();
    setUser(null);
    setAccessToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        login,
        register,
        logout,
        restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
