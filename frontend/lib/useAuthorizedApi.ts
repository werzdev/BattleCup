"use client";

import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useMemo } from "react";

const API_BASE_URL = "http://localhost:3001"; // Or use environment variable

export const useAuthorizedApi = () => {
  const { token, logout } = useAuth();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    // Optional: auto-logout on 401 errors
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout(); // Optional: auto-logout if token expired or invalid
        }
        return Promise.reject(error);
      },
    );

    return instance;
  }, [token, logout]);

  return api;
};
