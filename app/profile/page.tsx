"use client";

import { useEffect, useRef, useState } from "react";
import { auth, db, storage } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection, query, orderBy, onSnapshot, deleteDoc, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";
import { FaEdit, FaLongArrowAltLeft, FaPlus } from "react-icons/fa";
import { IoLogOutOutline, IoSettingsSharp } from "react-icons/io5";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaPencil } from "react-icons/fa6";

type Post = {
  userId: string;
  createdAt: any;
  [key: string]: any;
};

export default function ProfilePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [modalPost, setModalPost] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

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
        setPhotoUrl(data.photoUrl || null);
        setCoverUrl(data.coverUrl || null);
        setUserId(data.userId || null);
      } else {
        setUsername(user.email?.split("@")[0] || "User");
      }
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const run = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      // 6 оронтой ID үүсгэх
      const genId = () => Math.floor(100000 + Math.random() * 900000).toString();

      if (snap.exists()) {
        const data = snap.data();

        // 🔥 ХУУЧИН USER-д ID БАЙХГҮЙ БОЛ
        if (!data.userId) {
          const newId = genId();
          await setDoc(ref, { userId: newId }, { merge: true });
          setUserId(newId);
        } else {
          setUserId(data.userId);
        }
      } else {
        // 🔥 ШИНЭ USER
        const newId = genId();
        await setDoc(ref, {
          uid: user.uid,
          userId: newId,
        });
        setUserId(newId);
      }
    };

    run();
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
    await setDoc(userRef, { bio }, { merge: true });
    setShowSettings(false);
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
      { merge: true },
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
          <button onClick={() => router.push("/")} className="absolute top-0 left-0 text-xl md:m-10 m-5">
            <FaLongArrowAltLeft />
          </button>

          {/* <div className="flex items-center">
            <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gradient-to-tr from-purple-500 via-pink-400 to-yellow-300 flex items-center justify-center text-5xl font-extrabold text-white shadow-lg m-5">{photoUrl ? <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" /> : username?.[0]?.toUpperCase()}</div>
            <div className="mt-4 flex flex-col h-auto gap-2">
              <div className="flex">
                <h1 className="text-2xl text-purple-500 sm:text-3xl font-bold">{username}</h1>
                <button onClick={() => setShowSettings(true)} className="text-3xl mx-2">
                  <IoSettingsSharp className="text-purple-500" />
                </button>
              </div>
              <p className="text-gray-400 text-sm">{auth.currentUser?.email}</p>
              <p className="text-black">{userId}</p>
              {bio && <p className="text-gray-800">{bio}</p>}
            </div>
          </div> */}

          <div className="flex flex-col sm:flex-row items-center sm:items-center">
            {/* Profile picture */}
            <div
              className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white overflow-hidden
               bg-gradient-to-tr from-purple-500 via-pink-400 to-yellow-300
               flex items-center justify-center text-4xl sm:text-5xl
               font-extrabold text-white shadow-lg m-5"
            >
              {photoUrl ? <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" /> : username?.[0]?.toUpperCase()}
            </div>

            {/* User info */}
            <div
              className="flex flex-col justify-center items-center sm:items-start
               text-center sm:text-left gap-2"
            >
              <div className="flex items-center">
                <h1 className="text-xl text-rose-300 font-bold">{username}</h1>
                <button onClick={() => setShowSettings(true)} className="text-xl ml-2">
                  <IoSettingsSharp className="text-rose-300" />
                </button>
              </div>

              <p className="text-black text-sm text-xs sm:text-base sm:text-xs font-bold">ID: {userId}</p>

              <div className="w-full flex justify-around sm justify-between">
                <p className="font-bold text-sm">{posts.length} Post</p>
                <p className="font-bold text-sm">Followers</p>
                <p className="font-bold text-sm">Following</p>
              </div>
              {bio && <p className="font-medium text-xs sm:text-base max-w-xs sm:max-w-md">Bio: {bio}</p>}
            </div>
          </div>

          {/* Follower, Followers and Post info */}
          {/* Create Post */}
          <div className="w-full mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full">
                <button onClick={() => setModalPost({ title: "", description: "", date: "", imageUrl: "" })} className="flex-1 flex justify-center items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-xl font-semibold transition">
                  <FaPlus /> Create Post
                </button>
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="w-full mt-6">
            <p className="text-center font-bold text-xl mb-4">My Posts</p>

            <hr className="my-5"></hr>

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
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl w-full max-w-md sm:max-w-lg shadow-2xl relative p-6 sm:p-10">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold text-3xl z-50" onClick={() => setModalPost(null)}>
                  ×
                </button>

                <div className="flex gap-2">
                  <input type="file" onChange={(e) => setModalPost({ ...modalPost })} className="w-full mb-2 border p-2 rounded-sm" />

                  <div className="">
                    <input type="text" placeholder="Title" value={modalPost.title} onChange={(e) => setModalPost({ ...modalPost, title: e.target.value })} className="w-full p-2 border rounded mb-2" />
                    <input type="date" value={modalPost.date?.split("T")[0]} onChange={(e) => setModalPost({ ...modalPost, date: e.target.value })} className="w-full p-2 border rounded mb-2" />
                    <textarea placeholder="Description" value={modalPost.description} onChange={(e) => setModalPost({ ...modalPost, description: e.target.value })} className="w-full p-2 border rounded mb-2" />
                  </div>
                </div>
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
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
              <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-center">Settings</h2>

                <div className="flex items-center relative my-2 border rounded-xl">
                  <input type="text" maxLength={100} placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-2 outline-none" />
                  <div className="w-[30px] ml-2 p-2 rounded-sm">
                    <FaPencil onClick={() => handleSaveProfile()} className="" />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col items-centers justify-center">
                  <button className="flex items-center justify-center gap-1 text-red-500 border-1 p-2 my-3 rounded-xl" onClick={() => handleLogout()}>
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
