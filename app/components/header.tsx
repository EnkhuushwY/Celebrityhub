"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { IoBook, IoGift, IoHome, IoNotificationsOutline, IoPeopleSharp } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { onSnapshot, collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, updateDoc, getDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { FriendRequest, SendFriendRequestParams } from "@/utils/types";

type SendFriendRequestProps = {
  id: string;
  fromUid: string;
  toUid: string;
  status: "pending" | "accepted" | "ignored";
  createdAt: any;
  fromUsername?: string;
  fromPhoto?: string;
  toUsername?: string;
  toPhoto?: string;
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [friendSearchId, setFriendSearchId] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [user, loading, error] = useAuthState(auth);
  const [friendRequests, setFriendRequests] = useState<SendFriendRequestProps[]>([]);

  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Home", href: "/", icon: <IoHome /> },
    { name: "Memories", href: "/timeline", icon: <IoBook /> },
    { name: "Activities", href: "/gift", icon: <IoGift /> },
    { name: "Profile", href: "/profile", icon: <IoPeopleSharp /> },
    // { name: "Notification", href: "", icon: <IoNotificationsOutline /> },
  ];

  // Search user by ID
  const searchUserById = async (id: string) => {
    const q = query(collection(db, "users"), where("userId", "==", id));
    const snap = await getDocs(q);
    if (snap.empty) return null;

    const docSnap = snap.docs[0];
    return {
      uid: docSnap.id,
      userId: docSnap.data().userId,
      username: docSnap.data().username || "",
      photoUrl: docSnap.data().photoUrl || "",
    };
  };

  // Send friend request
  const sendFriendRequest = async ({ toUid, toUsername, toPhoto }: SendFriendRequestParams) => {
    const user = auth.currentUser;
    if (!user) throw new Error("You must be logged in");

    const requestId = `${user.uid}_${toUid}`;
    const requestRef = doc(db, "friendRequests", requestId);

    const existingRequest = await getDoc(requestRef);
    if (existingRequest.exists()) throw new Error("Friend request already sent");

    const newRequest: FriendRequest = {
      fromUid: user.uid,
      fromUsername: user.displayName || "Someone",
      fromPhoto: user.photoURL || "",
      toUid,
      toUsername: toUsername || "",
      toPhoto: toPhoto || "",
      status: "pending",
      createdAt: serverTimestamp(),
    };

    await setDoc(requestRef, newRequest);
  };

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "friendRequests"), where("toUid", "==", user.uid), where("status", "==", "pending"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, async (snap) => {
      const enriched = await Promise.all(
        snap.docs.map(async (docSnap) => {
          const data = docSnap.data() as Omit<SendFriendRequestProps, "id" | "fromUsername" | "fromPhoto">;

          const userDoc = await getDoc(doc(db, "users", data.fromUid));
          const userData = userDoc.exists() ? (userDoc.data() as { username: string; photoUrl: string }) : { username: "Unknown", photoUrl: "" };

          // 🔹 Бүх required field-ийг add хийж байна
          return {
            id: docSnap.id,
            fromUid: data.fromUid,
            toUid: data.toUid,
            status: data.status,
            createdAt: data.createdAt,
            fromUsername: userData.username,
            fromPhoto: userData.photoUrl,
          } as SendFriendRequestProps;
        }),
      );

      setFriendRequests(enriched);
    });

    return () => unsub();
  }, [user]);

  return (
    <div>
      <header className="fixed top-0 left-0 w-full bg-pink-100 backdrop-blur-md shadow-md z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
          <button onClick={() => router.push("/")} className="text-2xl font-bold text-rose-300">
            Celebrity Hub
          </button>

          <div className="hidden md:flex items-center border px-2 py-1 rounded-xl">
            <input type="text" className="w-96 rounded-md outline-none" placeholder="Enter your friend's ID here." value={friendSearchId} onChange={(e) => setFriendSearchId(e.target.value)} />
            <button
              disabled={!user || loading}
                onClick={async () => {
    try {
      const foundUser = await searchUserById(friendSearchId);
      if (!foundUser) {
        alert("User not found");
        return;
      }

      await sendFriendRequest({
        toUid: foundUser.uid,
        toUsername: foundUser.username,
        toPhoto: foundUser.photoUrl,
      });

      alert("Friend request sent!");
      setFriendSearchId("");
    } catch (err: any) {
      alert(err.message);
    }
  }}
              className="cursor-pointer hover:text-gray-300">
              <FaSearch className="border-l-1 w-auto pl-2" />
            </button>
          </div>

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
              <div className="flex items-center border px-2 py-1 rounded-xl">
                <input type="text" className="w-full rounded-md outline-none" placeholder="Enter your friend's ID here." />
                <FaSearch className="border-l-1 w-auto pl-2" />
              </div>
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
    </div>
  );
}
