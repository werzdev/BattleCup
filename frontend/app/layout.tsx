import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

export const metadata = {
  title: "BattleCup",
  description: "Track your epic 2v2 battles",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <AuthProvider>
          <Navbar />
          <main className="p-4 max-w-4xl mx-auto">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
