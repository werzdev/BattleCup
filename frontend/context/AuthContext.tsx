"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "@/lib/api"; // Use the standard API instance

type AuthContextType = {
  user: { username: string } | null;
  token: string | null;
  login: (username: string, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Utility to read cookies
  const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : null;
  };

  useEffect(() => {
    const token = getCookie("authToken");
    const username = getCookie("username");
    console.log("AuthContext - token from cookie:", token);
    console.log("AuthContext - username from cookie:", username);

    if (token && username) {
      setToken(token);
      setUser({ username });
    }
  }, []);

  const login = (username: string, token: string) => {
    setUser({ username });
    setToken(token);
    document.cookie = `authToken=${token}; path=/; max-age=86400; Secure; SameSite=Strict`;
    document.cookie = `username=${username}; path=/; max-age=86400; Secure; SameSite=Strict`; // Store username
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    document.cookie = "authToken=; path=/; max-age=0; Secure; SameSite=Strict";
    document.cookie = "username=; path=/; max-age=0; Secure; SameSite=Strict";
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
