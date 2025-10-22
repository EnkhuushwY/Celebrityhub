"use client";

import Header from "./components/header";
import Link from "next/link";
import ProtectedRoute from "./components/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="relative min-h-screen w-screen overflow-auto bg-pink-50 flex flex-col items-center justify-center px-6">
        <Header />

        <main className="flex flex-col items-center justify-center text-center mt-28 space-y-6">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900">
            Alles Gute zum Geburtstag, meine Liebe! 💖
          </h1>

          <p className="text-lg md:text-2xl text-gray-700 max-w-xl">
            Wishing you a day filled with love, laughter, and unforgettable memories. 💌
          </p>

          <div className="flex gap-4 mt-8">
            <Link
              href="/timeline"
              className="px-6 py-3 rounded-lg bg-purple-500 text-white font-semibold hover:bg-purple-600 transition"
            >
              See Memories
            </Link>

            <Link
              href="/gift"
              className="px-6 py-3 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
            >
              Plan Activities
            </Link>
          </div>
        </main>
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
