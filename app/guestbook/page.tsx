"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

const presetMessage = `
🎉 Happy Birthday! 🎂💖
Надтай хамт өнгөрүүлсэн өдрүүд үнэхээр дурсамжтай байлаа!
`;

export default function BirthdayCardButton() {
  const [clicked, setClicked] = useState(false);
  const [bgColor, setBgColor] = useState("bg-pink-100");
  const [user, loading] = useAuthState(auth);

  const handleClick = () => {
    setClicked(true);
    setBgColor("bg-yellow-100");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-pink-50">
      {!clicked && (
        <button
          onClick={handleClick}
          className={`
            text-6xl font-bold w-32 h-32 rounded-full bg-purple-500 text-white shadow-lg
            flex items-center justify-center transition transform duration-300
            hover:scale-110 hover:bg-pink-500 active:scale-95
          `}>
          💌
        </button>
      )}

      {clicked && (
        <div
          className={`
            mt-10 p-6 max-w-sm rounded-xl shadow-lg text-center
            ${bgColor} transition-colors duration-500 animate-scale-up
          `}>
          <h2 className="text-2xl font-bold text-pink-600 mb-4">
             {user?.displayName} Birthday Card
          </h2>
          <p className="mb-5 text-gray-700 whitespace-pre-wrap">{presetMessage}</p>
          <Link
            href="/"
            className="px-4 py-2 bg-purple-400 rounded-full text-white font-bold hover:bg-purple-300 transition">
            Back Home
          </Link>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-up {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scale-up {
          animation: scale-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
