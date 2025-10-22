"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";

export default function ProfilePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [bio, setBio] = useState("This user hasn't written a bio yet.");
  const [favoriteSong, setFavoriteSong] = useState("No favorite song yet 🎵");
  const [editMode, setEditMode] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [newSong, setNewSong] = useState("");
  const [recentMemories, setRecentMemories] = useState<any[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return router.push("/login");

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(data.username || user.email?.split("@")[0] || "User");
          setBio(data.bio || "This user hasn't written a bio yet.");
          setFavoriteSong(data.favoriteSong || "No favorite song yet 🎵");
        } else {
          setUsername(user.email?.split("@")[0] || "User");
        }

        // Load last 3 memories
        const memoriesRef = collection(db, "memories");
        const q = query(memoriesRef, orderBy("createdAt", "desc"), limit(3));
        const snapshot = await getDocs(q);
        const memoriesData = snapshot.docs.map((doc) => doc.data());
        setRecentMemories(memoriesData);

        setShowConfetti(true); // show confetti on load
        setTimeout(() => setShowConfetti(false), 5000); // 5 sec
      } catch {
        setUsername(user.email?.split("@")[0] || "User");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    const userRef = doc(db, "users", auth.currentUser.uid);

    await setDoc(
      userRef,
      { bio: newBio || bio, favoriteSong: newSong || favoriteSong },
      { merge: true }
    );

    setBio(newBio || bio);
    setFavoriteSong(newSong || favoriteSong);
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white flex flex-col items-center py-10 px-4 relative">
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}
      
      {/* Top Banner */}
      <div className="w-full h-40 bg-gradient-to-r from-purple-500 via-pink-400 to-yellow-300"></div>

      {/* Avatar + Username Section */}
      <div className="relative -mt-20 w-full max-w-xl flex flex-col items-center">
        <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gradient-to-tr from-purple-500 via-pink-400 to-yellow-300 flex items-center justify-center text-6xl font-extrabold text-white shadow-lg">
          {username ? username[0].toUpperCase() : "U"}
        </div>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">{username}</h1>
        <p className="text-gray-400 text-sm mt-1">{auth.currentUser?.email?.split("@")[0]}</p>
      </div>

      {/* Bio & Favorite Song Section */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg mt-8 p-6 flex flex-col gap-4">
        {!editMode ? (
          <>
            <div>
              <h2 className="text-gray-600 font-semibold">Bio</h2>
              <p className="text-gray-800 mt-1">{bio}</p>
            </div>
            <div>
              <h2 className="text-gray-600 font-semibold">Favorite Song</h2>
              <p className="text-purple-500 mt-1 font-medium">{favoriteSong}</p>
            </div>
            <button
              onClick={() => {
                setNewBio(bio);
                setNewSong(favoriteSong);
                setEditMode(true);
              }}
              className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-white py-2 rounded-xl font-semibold transition"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Your Bio"
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
            />
            <input
              type="text"
              placeholder="Favorite Song"
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
              value={newSong}
              onChange={(e) => setNewSong(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-xl font-semibold transition"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-xl font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>

      {/* Recent Memories */}
      {recentMemories.length > 0 && (
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg mt-6 p-6 flex flex-col gap-4">
          <h2 className="text-gray-700 font-bold text-lg">Recent Memories 🎉</h2>
          {recentMemories.map((mem, idx) => (
            <div key={idx} className="p-3 border rounded-xl bg-purple-50">
              <p className="text-gray-800">{mem.content || "Memory content"}</p>
              <p className="text-gray-500 text-xs mt-1">
                {mem.createdAt?.toDate ? mem.createdAt.toDate().toLocaleString() : ""}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-6 w-full max-w-xl bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-xl font-semibold shadow-md transition transform hover:scale-[1.01]"
      >
        Logout
      </button>
    </div>
  );
}
