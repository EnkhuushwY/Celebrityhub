"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  browserSessionPersistence,
  setPersistence,
  signInWithRedirect,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { useAuthState } from "react-firebase-hooks/auth";
import { isMobile } from "react-device-detect"

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await setPersistence(auth, browserSessionPersistence);
      if (isMobile) {
        await signInWithRedirect(auth, provider); // Mobile fallback
      } else {
        await signInWithPopup(auth, provider); // Desktop
      };
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-white px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md text-center space-y-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">Welcome 💫</h1>
        <p className="text-gray-600 text-sm md:text-base">
          Log in to continue spreading birthday joy 🎂
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">{error}</p>}

          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition transform hover:scale-[1.02]"
          >
            Login
          </button>
        </form>

        <div className="flex items-center justify-center gap-2">
          <div className="w-1/4 h-[1px] bg-gray-300" />
          <span className="text-gray-500 text-sm">or</span>
          <div className="w-1/4 h-[1px] bg-gray-300" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 font-medium hover:bg-gray-50 transition"
        >
          <FcGoogle className="text-2xl" />
          Continue with Google
        </button>

        <p className="text-gray-600 text-sm mt-4">
          Don’t have an account?
          <a href="/signup" className="text-purple-600 font-semibold hover:underline mx-2">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
