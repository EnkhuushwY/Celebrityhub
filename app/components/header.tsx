"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { IoBook, IoGift, IoHome, IoPeopleSharp } from "react-icons/io5";
import logo from "../assets/logo.jpg";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Home", href: "/", icon: <IoHome /> },
    { name: "Memories", href: "/timeline", icon: <IoBook /> },
    { name: "Activities", href: "/gift", icon: <IoGift /> },
    { name: "Profile", href: "/profile", icon: <IoPeopleSharp /> },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-pink-100 backdrop-blur-md shadow-md z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
        <button onClick={() => router.push("/")} className="text-2xl font-bold text-rose-300">
          Celebrity Hub
        </button>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6 text-gray-600 font-medium">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="hover:text-purple-500 transition">
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-800 text-2xl">
            {isOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <nav className="md:hidden  bg-pink-100 shadow-md">
          <ul className="flex flex-col gap-4 px-6 py-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="flex text-gray-700 font-medium items-center gap-1" onClick={() => setIsOpen(false)}>
                  {link.icon}
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
