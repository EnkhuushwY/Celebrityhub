"use client";

import Link from "next/link";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user] = useAuthState(auth);
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Memories", href: "/timeline" },
    { name: "Activities", href: "/gift" },
    // { name: "Messages", href: "/guestbook" },
    { name: "Profile", href: "/profile" }
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-pink-100 backdrop-blur-md shadow-md z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
        <h1 className="text-2xl font-bold text-pink-500">Celebrity Hub</h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6 text-gray-600 font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-purple-500 transition"
            >
              {link.name}
            </Link>
          ))}

          {!user ? (
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-purple-500 text-white font-semibold hover:bg-purple-600 transition"
            >
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="hover:text-purple-500 transition"
              >
                Logout
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-800 text-2xl focus:outline-none"
          >
            {isOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <nav className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col gap-4 px-6 py-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="block text-gray-700 font-medium hover:text-purple-500 transition"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {!user ? (
              <li>
                <Link
                  href="/login"
                  className="block px-4 py-2 rounded-lg bg-purple-500 text-white text-center font-semibold hover:bg-purple-600 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              </li>
            ) : (
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:text-purple-500 transition"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
