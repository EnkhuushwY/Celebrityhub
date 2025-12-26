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

  const greeting = " Wishing you a day filled with warmth, laughter, and the sweetest memories. Let’s make this celebration unforgettable 💖";

  const letter =
    "Сайн уу! Энэ захиаг унших өдрийн мэнд . 12.04нд чиний хувьд маш чухал өдөр. Хайр нь төрсөн өдрөөр нь энэ линкийг илгээе гэсэн болохооргүй болсоон. Чамд зориулж хийсэн өчүүхэн зүйлийг минь хүлээн авна уу🤗. Миний амьдралд нар мэт гялалзаж орж ирж, амьдралыг илүү утга учиртай болгосон. Намайг үргэлж хайраар булж, жинхэнэ эрхийн балай болгосон, инээмсэглэлээрээ үргэлж жаргалтай болгодог хамгийн нандин, үнэ цэнэтэй нэгэн нь юм байгаан🥰. Үргэлж жаргалтай, инээд хөөрөөр дүүрэн, баяр хөөртэй, юунаас ч айж санаа зовохгүй үргэлж аз жаргалтай. Хэцүү үе бүхэнд нь хайр нь дандаа хажууд нь шүү❤️. Чамдаа нь би хязгааргүй их хайртай шүү❤️❤️. Ирээдүйд хамтдаа хичээж, хамтдаа амьдралаа босгож, хамтдаа бүхнийг даван туулна шүү жа юу😘. Төрсөн өдрөө хамгийн гоёоор хэзээ ч мартагдахааргүй галзуу тэмдэглээрэй залуу насан дээрээ л саагахгүй бол өөр хэзээ саагахав. Үүрд чамтайгаа хамт байнаа.";

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-screen overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 flex flex-col justify-center items-center">
        <Header />

        {/* ✨ Background effects */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>

        <main className="relative z-10 flex flex-col items-center text-center mt-24 px-6">
          {/* 🎉 Title + Modal trigger */}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-3xl md:text-6xl font-extrabold text-gray-800 leading-snug">
            <button onClick={() => setIsOpen(true)} className="hover:scale-125 transition">
              💐
            </button>
            Happy Birthday, <p className="text-purple-600">{user?.displayName}</p>
          </motion.h1>

          {/* ✨ Greeting */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-lg md:text-2xl text-gray-700 max-w-2xl mt-6">
            {greeting}
          </motion.p>

          {/* 🏷 Buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="flex flex-wrap justify-center gap-4 mt-10">
            <Link href="/timeline" className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition">
              🎞 See Memories
            </Link>
            <Link href="/gift" className="px-8 py-3 rounded-full bg-white text-purple-600 border border-purple-300 font-semibold shadow hover:bg-purple-50 transition">
              🎁 Words of encouragement
            </Link>
          </motion.div>

          <p className="text-gray-500 text-sm mt-20 mb-8">Crafted with 💜 for someone special</p>
        </main>

        {/* 💌 Modal (responsive fixed) */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={() => setIsOpen(false)}>
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 text-center w-full max-w-[650px] animate-fadeIn">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">💌 Letterentser</h2>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed whitespace-pre-line">{letter}</p>
              <p className="font-bold">Written by: Mysterious one</p>

              <button onClick={() => setIsOpen(false)} className="mt-6 bg-gradient-to-r from-pink-400 to-purple-500 text-white px-8 py-3 rounded-full hover:scale-105 transition">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
