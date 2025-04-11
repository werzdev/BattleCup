"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username && password) {
      try {
        const response = await api.post("/auth/login", { username, password });

        // Extract the token from the response
        const token = response.data?.user?.token; // Adjust to match your backend response structure
        if (token) {
          // Store the token in a cookie
          document.cookie = `authToken=${token}; path=/; max-age=86400; Secure; SameSite=Strict`;

          // Call the login function from AuthContext
          login(username, token);

          // Redirect to the home page
          router.push("/");
        } else {
          setError("No token received");
        }
      } catch (err) {
        console.error("Login failed", err);
        setError("Invalid credentials");
      }
    } else {
      setError("Please provide a valid username and password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              required
            />
          </div>
          <div>
            <label className="block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
