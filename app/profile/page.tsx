"use client";

import { useEffect, useState } from "react";
import { auth, db, storage } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import ProtectedRoute from "../components/ProtectedRoute";

export default function ProfilePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [favoriteSong, setFavoriteSong] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [modalPost, setModalPost] = useState<any>(null);

  const router = useRouter();

  // Auth & User Info
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return router.push("/login");
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsername(data.username || user.email?.split("@")[0] || "User");
        setBio(data.bio || "");
        setFavoriteSong(data.favoriteSong || "");
        setPhotoUrl(data.photoUrl || null);
        setCoverUrl(data.coverUrl || null);
      } else {
        setUsername(user.email?.split("@")[0] || "User");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Fetch user posts in realtime
  useEffect(() => {
    if (!auth.currentUser) return;
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userPosts = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((post) => post.userId === auth.currentUser?.uid);
      setPosts(userPosts);
    });
    return () => unsubscribe();
  }, [auth.currentUser]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleSaveProfile = async () => {
    if (!auth.currentUser) return;
    const userRef = doc(db, "users", auth.currentUser.uid);
    await setDoc(userRef, { bio, favoriteSong }, { merge: true });
    setEditMode(false);
  };

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover"
  ) => {
    if (!e.target.files?.[0] || !auth.currentUser) return;
    const file = e.target.files[0];
    const storageRef = ref(storage, `users/${auth.currentUser.uid}/${type}.jpg`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    const userRef = doc(db, "users", auth.currentUser.uid);
    await setDoc(userRef, type === "profile" ? { photoUrl: url } : { coverUrl: url }, {
      merge: true,
    });
    type === "profile" ? setPhotoUrl(url) : setCoverUrl(url);
  };

  const handleCreateOrEditPost = async (post: any, file?: File) => {
    if (!auth.currentUser) return;
    let imageUrl = post.imageUrl || "";
    if (file) {
      const storageRef = ref(storage, `posts/${auth.currentUser.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }
    const postRef = doc(db, "posts", post.id || new Date().getTime().toString());
    await setDoc(
      postRef,
      {
        userId: auth.currentUser.uid,
        title: post.title,
        description: post.description,
        date: post.date,
        imageUrl,
        createdAt: new Date(),
      },
      { merge: true }
    );
    setModalPost(null);
  };

  const handleDeletePost = async (postId: string) => {
    const postRef = doc(db, "posts", postId);
    await deleteDoc(postRef);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 flex flex-col items-center px-4 sm:px-6 md:px-8 py-6">
        {/* Back Button */}
        <div className="w-full max-w-3xl flex flex-col items-center bg-white rounded-xl p-6 md:p-10 shadow-lg relative">
          {/* Profile Section */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => router.push("/")}
              className="self-start text-black hover:text-purple-700 font-5xl text-2xl mb-4"
            >
              ←
            </button>

            <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gradient-to-tr from-purple-500 via-pink-400 to-yellow-300 flex items-center justify-center text-5xl font-extrabold text-white shadow-lg">
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                username?.[0]?.toUpperCase()
              )}
            </div>
            <h1 className="mt-4 text-2xl sm:text-3xl font-bold">{username}</h1>
            <p className="text-gray-400 text-sm">{auth.currentUser?.email?.split("@")}</p>
          </div>

          {/* Bio & Favorite Song */}
          <div className="w-full mt-6 flex flex-col gap-4">
            {!editMode ? (
              <div className="flex flex-col gap-2">
                {bio && <p className="text-gray-800">{bio}</p>}
                {favoriteSong && <p className="text-purple-500 font-medium">{favoriteSong}</p>}
                <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full">
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white py-2 rounded-xl font-semibold transition"
                  >
                    ✏️ Edit Profile
                  </button>
                  <button
                    onClick={() =>
                      setModalPost({ title: "", description: "", date: "", imageUrl: "" })
                    }
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-xl font-semibold transition"
                  >
                    ➕ Create Post
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
                />
                <input
                  type="text"
                  placeholder="Favorite Song"
                  value={favoriteSong}
                  onChange={(e) => setFavoriteSong(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
                />
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <button
                    onClick={handleSaveProfile}
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
              </div>
            )}
          </div>

          {/* Posts Grid */}
          <div className="w-full mt-6">
            <p className="text-center font-bold text-xl mb-4">My Posts</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white p-2 rounded shadow cursor-pointer hover:scale-105 transition transform"
                  onClick={() => setModalPost(post)}
                >
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="h-40 w-full object-cover rounded mb-2"
                    />
                  )}
                  <h2 className="font-bold">{post.title}</h2>
                  <p className="text-gray-600 text-sm">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Post Modal */}
          {modalPost && (
            <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 bg-opacity-60 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl w-full max-w-md sm:max-w-lg shadow-2xl relative p-6 sm:p-10">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold text-3xl z-50"
                  onClick={() => setModalPost(null)}
                >
                  ×
                </button>

                <input
                  type="text"
                  placeholder="Title"
                  value={modalPost.title}
                  onChange={(e) => setModalPost({ ...modalPost, title: e.target.value })}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="date"
                  value={modalPost.date?.split("T")[0]}
                  onChange={(e) => setModalPost({ ...modalPost, date: e.target.value })}
                  className="w-full p-2 border rounded mb-2"
                />
                <textarea
                  placeholder="Description"
                  value={modalPost.description}
                  onChange={(e) => setModalPost({ ...modalPost, description: e.target.value })}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="file"
                  onChange={(e) => setModalPost({ ...modalPost, file: e.target.files?.[0] })}
                  className="w-full mb-2 border p-2"
                />
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <button
                    onClick={() => handleCreateOrEditPost(modalPost, modalPost.file)}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-xl font-semibold transition"
                  >
                    Save
                  </button>
                  {modalPost.id && (
                    <button
                      onClick={() => handleDeletePost(modalPost.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
