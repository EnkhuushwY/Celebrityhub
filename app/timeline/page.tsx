"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import ProtectedRoute from "../components/ProtectedRoute";
import Header from "../components/header";
import { IoClose } from "react-icons/io5";

type Post = {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
};

export default function TimelinePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selected, setSelected] = useState<Post | null>(null);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <ProtectedRoute>
      <Header />
      <div className="min-h-screen p-8 flex flex-col items-center bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100">
        
        <h1 className="text-4xl font-bold mt-15 mb-8 text-purple-700">Our Memories❤️</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:scale-105 transform transition"
              onClick={() => setSelected(post)}
            >
              {post.imageUrl ? (
                <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <div className="p-4">
                <h2 className="font-bold text-lg">{post.title}</h2>
                <p className="text-sm text-gray-500">{post.date}</p>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full overflow-hidden relative">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 text-white text-3xl"
              >
                <IoClose />
              </button>
              {selected.imageUrl && (
                <img
                  src={selected.imageUrl}
                  alt={selected.title}
                  className="w-full h-96 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 text-purple-500">{selected.title}</h2>
                <p className="text-gray-700 mb-2">{selected.description}</p>
                <p className="text-gray-400 text-sm">{selected.date}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
