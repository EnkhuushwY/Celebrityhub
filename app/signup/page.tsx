"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) return setError("All fields are required");

    // Fake email ашиглана: username@myapp.com
    const email = `${username}`;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/"); // signup амжилттай бол home руу
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/"); // Google signup амжилттай бол home руу
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-white px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md text-center space-y-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
          Sign Up 🎉
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Create your account to start celebrating birthdays together 🎂
        </p>

        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

          {error && (
            <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition transform hover:scale-[1.02]"
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center justify-center gap-2">
          <div className="w-1/4 h-[1px] bg-gray-300" />
          <span className="text-gray-500 text-sm">or</span>
          <div className="w-1/4 h-[1px] bg-gray-300" />
        </div>

        <button
          onClick={handleGoogleSignUp}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 font-medium hover:bg-gray-50 transition"
        >
          <FcGoogle className="text-2xl" />
          Sign Up with Google
        </button>

        <p className="text-gray-600 text-sm mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-purple-600 font-semibold hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
