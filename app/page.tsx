"use client";

import Header from "./components/header";
import Link from "next/link";
import ProtectedRoute from "./components/ProtectedRoute";
import { motion } from "framer-motion";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [user] = useAuthState(auth);

  const greeting =
    " Wishing you a day filled with warmth, laughter, and the sweetest memories. Let’s make this celebration unforgettable 💖";

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-screen overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 flex flex-col justify-center items-center">
        {/* Header */}
        <Header />

        {/* Floating gradient background blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>

        {/* Main content */}
        <main className="relative z-10 flex flex-col items-center justify-center text-center mt-24 px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-6xl font-extrabold text-gray-800 leading-snug"
          >
            <button onClick={() => setIsOpen(true)}>💐</button> Happy Birthday,{" "}
            <p className="text-purple-600">{user?.displayName}</p>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-2xl text-gray-700 max-w-2xl mt-6"
          >
           {greeting}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mt-10"
          >
            <Link
              href="/timeline"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-200"
            >
              🎞 See Memories
            </Link>

            <Link
              href="/gift"
              className="px-8 py-3 rounded-full bg-white text-purple-600 border border-purple-300 font-semibold shadow hover:bg-purple-50 transition"
            >
              🎁 Plan Activities
            </Link>
          </motion.div>

          {/* Extra subtle footer-like note */}
          <p className="text-gray-500 text-sm mt-20 mb-8">Crafted with 💜 for someone special</p>
        </main>
        {/* Modal */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setIsOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl p-8 text-center w-[90%] max-w-md animate-fadeIn"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                💌 Random one to special person
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">{greeting}</p>

              <button
                onClick={() => setIsOpen(false)}
                className="mt-6 bg-gradient-to-r from-pink-400 to-purple-500 text-white px-6 py-2 rounded-full hover:scale-105 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

// "use client";

// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "@/lib/firebase";
// import { useRouter } from "next/navigation";
// import BirthdayCardButton from "./components/BirthdayCardButton";

// export default function Home() {
//   const [user, loading] = useAuthState(auth);
//   const router = useRouter();

//   if (loading) return <p>Loading...</p>;
//   if (!user) {
//     router.push("/login");
//     return null;
//   }

//   return (
//     <main className="flex flex-col items-center justify-center min-h-screen bg-pink-100">
//       <h1 className="text-4xl font-bold mb-4">
//         🎂 Welcome, {user.displayName || "Friend"}!
//       </h1>
//       <p className="text-gray-700 mb-6 text-center">
//         Let’s make this birthday unforgettable 💖
//       </p>
//       <BirthdayCardButton />
//     </main>
//   );
// }
