"use client";

import { useEffect, useState } from "react";
import { auth, db, storage } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection, query, orderBy, onSnapshot, deleteDoc, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";
import { FaEdit, FaLongArrowAltLeft, FaPlus } from "react-icons/fa";
import { IoLogOutOutline, IoSettingsSharp } from "react-icons/io5";
import { useAuthState } from "react-firebase-hooks/auth";

type Post = {
  userId: string;
  createdAt: any;
  [key: string]: any;
};

export default function ProfilePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [favoriteSong, setFavoriteSong] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [modalPost, setModalPost] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);

  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  // Fetch user info
  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
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
    };
    fetchUserData();
  }, [user]);

  // Fetch user posts
  useEffect(() => {
    if (!user) return;
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Post) })).filter((post) => post.userId === user.uid);
      setPosts(userPosts);
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login");
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { bio, favoriteSong }, { merge: true });
    setEditMode(false);
  };

  const handleCreateOrEditPost = async (post: any, file?: File) => {
    if (!user) return;
    let imageUrl = post.imageUrl || "";
    if (file) {
      const storageRef = ref(storage, `posts/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }
    const postRef = doc(db, "posts", post.id || new Date().getTime().toString());
    await setDoc(
      postRef,
      {
        userId: user.uid,
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

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 flex flex-col items-center px-4 sm:px-6 md:px-8 py-6">
        {/* Back Button */}
        <div className="w-full max-w-3xl flex flex-col items-center bg-white rounded-xl p-6 mt-10 md:m-0 md:p-10 shadow-lg relative">
          <div className="flex flex-col items-center">
            <button onClick={() => router.push("/")} className="absolute top-0 left-0 text-xl md:m-10 m-5">
              <FaLongArrowAltLeft />
            </button>

            <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gradient-to-tr from-purple-500 via-pink-400 to-yellow-300 flex items-center justify-center text-5xl font-extrabold text-white shadow-lg">{photoUrl ? <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" /> : username?.[0]?.toUpperCase()}</div>
            <div className="mt-4 flex h-auto items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold">{username}</h1>
              <button onClick={() => setShowSettings(true)} className="text-3xl">
                <IoSettingsSharp />
              </button>
            </div>
            <p className="text-gray-400 text-sm">{auth.currentUser?.email}</p>
          </div>

          {/* Bio & Favorite Song */}
          <div className="w-full mt-6 flex flex-col gap-4">
            {!editMode ? (
              <div className="flex flex-col gap-2">
                {bio && <p className="text-gray-800">{bio}</p>}

                <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full">
                  <button onClick={() => setEditMode(true)} className="flex-1 flex justify-center items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white py-2 rounded-xl font-semibold transition">
                    <FaEdit /> Edit Profile
                  </button>
                  <button onClick={() => setModalPost({ title: "", description: "", date: "", imageUrl: "" })} className="flex-1 flex justify-center items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-xl font-semibold transition">
                    <FaPlus /> Create Post
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <input type="text" placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none" />

                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <button onClick={handleSaveProfile} className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-xl font-semibold transition">
                    Save
                  </button>
                  <button onClick={() => setEditMode(false)} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-xl font-semibold transition">
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
                <div key={post.id} className="bg-white p-2 rounded shadow cursor-pointer hover:scale-105 transition transform" onClick={() => setModalPost(post)}>
                  {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="h-40 w-full object-cover rounded mb-2" />}
                  <h2 className="font-bold">{post.title}</h2>
                  <p className="text-gray-600 text-sm">{new Date(post.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Post Modal */}
          {modalPost && (
            <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 bg-opacity-60 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl w-full max-w-md sm:max-w-lg shadow-2xl relative p-6 sm:p-10">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold text-3xl z-50" onClick={() => setModalPost(null)}>
                  ×
                </button>

                <input type="text" placeholder="Title" value={modalPost.title} onChange={(e) => setModalPost({ ...modalPost, title: e.target.value })} className="w-full p-2 border rounded mb-2" />
                <input type="date" value={modalPost.date?.split("T")[0]} onChange={(e) => setModalPost({ ...modalPost, date: e.target.value })} className="w-full p-2 border rounded mb-2" />
                <textarea placeholder="Description" value={modalPost.description} onChange={(e) => setModalPost({ ...modalPost, description: e.target.value })} className="w-full p-2 border rounded mb-2" />
                <input type="file" onChange={(e) => setModalPost({ ...modalPost, file: e.target.files?.[0] })} className="w-full mb-2 border p-2" />
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <button onClick={() => handleCreateOrEditPost(modalPost, modalPost.file)} className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-xl font-semibold transition">
                    Save
                  </button>
                  {modalPost.id && (
                    <button onClick={() => handleDeletePost(modalPost.id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold transition">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {showSettings && (
            <div onClick={() => setShowSettings(false)} className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
              <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-center">Settings</h2>

                {/* Buttons */}
                <div className="flex flex-col items-centers justify-center">
                  <button className="flex items-center justify-center pb-5 gap-1 text-red-500" onClick={() => handleLogout()}>
                    <IoLogOutOutline />
                    Log out
                  </button>

                  <hr></hr>

                  <button className="pt-5" onClick={() => setShowSettings(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
