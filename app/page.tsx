"use client";

import Header from "./components/header";
import Link from "next/link";
import ProtectedRoute from "./components/ProtectedRoute";
import { motion } from "framer-motion";
import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { IoNotificationsOutline } from "react-icons/io5";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";

type FriendRequest = {
  id: string;
  fromUid: string;
  toUid: string;
  status: "pending" | "accepted" | "ignored";
  createdAt: any;
  fromUsername?: string;
  fromPhoto?: string;
};

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [user] = useAuthState(auth);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);


  // Accept friend request
    const handleAccept = async (requestId: string, fromUid: string) => {
      if (!user) return;
  
      const ref = doc(db, "friendRequests", requestId);
  
      // Update status only
      await updateDoc(ref, { status: "accepted" });
  
      // Add to friends collection
      await addDoc(collection(db, "friends"), {
        user1: user.uid,
        user2: fromUid,
        createdAt: serverTimestamp(),
      });
  
      alert("Friend request accepted!");
    };
  
    // Ignore friend request
    const handleIgnore = async (requestId: string) => {
      if (!user) return;
  
      const ref = doc(db, "friendRequests", requestId);
  
      await updateDoc(ref, { status: "ignored" });
  
      alert("Friend request ignored!");
    };
  

  const unreadCount = notifications.filter((n) => !n.read).length;

  const greeting = " Wishing you a day filled with warmth, laughter, and the sweetest memories. Let’s make this celebration unforgettable 💖";

  const letter =
    "Сайн уу! Энэ захиаг унших өдрийн мэнд . 12.04нд чиний хувьд маш чухал өдөр. Хайр нь төрсөн өдрөөр нь энэ линкийг илгээе гэсэн болохооргүй болсоон. Чамд зориулж хийсэн өчүүхэн зүйлийг минь хүлээн авна уу🤗. Миний амьдралд нар мэт гялалзаж орж ирж, амьдралыг илүү утга учиртай болгосон. Намайг үргэлж хайраар булж, жинхэнэ эрхийн балай болгосон, инээмсэглэлээрээ үргэлж жаргалтай болгодог хамгийн нандин, үнэ цэнэтэй нэгэн нь юм байгаан🥰. Үргэлж жаргалтай, инээд хөөрөөр дүүрэн, баяр хөөртэй, юунаас ч айж санаа зовохгүй үргэлж аз жаргалтай. Хэцүү үе бүхэнд нь хайр нь дандаа хажууд нь шүү❤️. Чамдаа нь би хязгааргүй их хайртай шүү❤️❤️. Ирээдүйд хамтдаа хичээж, хамтдаа амьдралаа босгож, хамтдаа бүхнийг даван туулна шүү жа юу😘. Төрсөн өдрөө хамгийн гоёоор хэзээ ч мартагдахааргүй галзуу тэмдэглээрэй залуу насан дээрээ л саагахгүй бол өөр хэзээ саагахав. Үүрд чамтайгаа хамт байнаа.";

  return (
    <div className="min-h-screen w-screen overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 flex flex-col justify-center items-center">
      <Header />

      {/* ✨ Background effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>

      <main className="relative z-10 flex flex-col items-center text-center mt-24 px-6">
        {/* 🎉 Title + Modal trigger */}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-3xl md:text-6xl font-extrabold text-gray-800 leading-snug">
          {/* <button onClick={() => setIsOpen(true)} className="hover:scale-125 transition">
              💐
            </button> */}
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
          <Link href="/gift" className="px-8 py-3 rounded-full bg-white text-purple-600 border border-purple-300 font-semibold shadow hover:bg-purple-50 hover:scale-105 transition">
            🎁 Words of encouragement
          </Link>
        </motion.div>
      </main>
      <div className="absolute right-10 bottom-15 md:flex md:right-30 md:p-4 cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full" onClick={() => setShowNotifModal(true)}>
        <IoNotificationsOutline className="text-2xl text-white" />
        {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{unreadCount}</span>}
      </div>

      {/* 💌 Modal (responsive fixed)
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
        )} */}

      {/* Notification friend request list modal */}
      {showNotifModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-96 max-w-full p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Friend Requests</h2>
            {friendRequests.length === 0 ? (
              <p className="text-gray-500">No pending requests</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {friendRequests.map((req) => (
                  <li key={req.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <div className="flex items-center gap-2">
                      <img src={req.fromPhoto} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                      <span>{req.fromUsername}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleAccept(req.id, req.fromUid)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                        Accept
                      </button>
                      <button onClick={() => handleIgnore(req.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                        Ignore
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button className="mt-4 w-full bg-gray-200 py-1 rounded" onClick={() => setShowNotifModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
