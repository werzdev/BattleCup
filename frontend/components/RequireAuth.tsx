"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for authentication state to initialize
    if (user || token) {
      setIsLoading(false); // Authenticated, stop loading
    } else if (!user && !token) {
      router.replace("/login"); // Redirect to login if not authenticated
    }
  }, [user, token, router]);

  if (isLoading) {
    // Show a loading spinner or placeholder while checking authentication
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
};
