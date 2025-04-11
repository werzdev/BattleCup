"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4 shadow-md flex justify-between items-center">
      <span className="text-xl text-white font-bold">BattleCup</span>
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="text-white">
            Home
          </Link>
        </li>
        <li>
          <Link href="/players" className="text-white">
            Players
          </Link>
        </li>
        <li>
          <Link href="/games" className="text-white">
            Games
          </Link>
        </li>
        <li>
          {user ? (
            <button
              onClick={logout}
              className="text-white bg-red-500 px-4 py-2 rounded"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className="text-white">
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
