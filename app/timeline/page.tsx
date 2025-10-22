"use client";

import Link from "next/link";
import { useState } from "react";

type Memory = {
  date: string;
  title: string;
  description: string;
  imageSrc: string;
};

const memories: Memory[] = [
  {
    date: "2022-05-01",
    title: "Анхны уулзалт 💕",
    description: "Бид анх уулзсан өдөр, тэр өдөр үнэхээр мартагдашгүй байлаа.",
    imageSrc: "/memories/meeting.jpg",
  },
  {
    date: "2023-03-14",
    title: "Кино өдөр 🍿",
    description: "Бид хамт кино үзэж, popcorn идэж хөгжилтэй өдөр өнгөрүүлсэн.",
    imageSrc: "/memories/movie.jpg",
  },
  {
    date: "2024-07-07",
    title: "Сюрприз бэлэг 🎁",
    description: "Чамд зориулж бэлэг бэлдсэн өдөр, чи үнэхээр баярласан шүү!",
    imageSrc: "/memories/gift.jpg",
  },
  {
    date: "2022-05-01",
    title: "Анхны уулзалт 💕",
    description: "Бид анх уулзсан өдөр, тэр өдөр үнэхээр мартагдашгүй байлаа.",
    imageSrc: "/memories/meeting.jpg",
  },
  {
    date: "2023-03-14",
    title: "Кино өдөр 🍿",
    description: "Бид хамт кино үзэж, popcorn идэж хөгжилтэй өдөр өнгөрүүлсэн.",
    imageSrc: "/memories/movie.jpg",
  },
  {
    date: "2024-07-07",
    title: "Сюрприз бэлэг 🎁",
    description: "Чамд зориулж бэлэг бэлдсэн өдөр, чи үнэхээр баярласан шүү!",
    imageSrc: "/memories/gift.jpg",
  },
  {
    date: "2022-05-01",
    title: "Анхны уулзалт 💕",
    description: "Бид анх уулзсан өдөр, тэр өдөр үнэхээр мартагдашгүй байлаа.",
    imageSrc: "/memories/meeting.jpg",
  },
  {
    date: "2023-03-14",
    title: "Кино өдөр 🍿",
    description: "Бид хамт кино үзэж, popcorn идэж хөгжилтэй өдөр өнгөрүүлсэн.",
    imageSrc: "/memories/movie.jpg",
  },
  {
    date: "2024-07-07",
    title: "Сюрприз бэлэг 🎁",
    description: "Чамд зориулж бэлэг бэлдсэн өдөр, чи үнэхээр баярласан шүү!",
    imageSrc: "/memories/gift.jpg",
  },
];

export default function Timeline() {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  return (
    <div className="min-h-screen w-screen overflow-x-hidden overflow-y-auto bg-gradient-to-b from-pink-100 to-purple-100 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-purple-700">
        Our Memories ❤️
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {memories.map((memory, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:scale-105 transform transition duration-300"
            onClick={() => setSelectedMemory(memory)}>
            <img
              src={memory.imageSrc}
              alt={memory.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="font-bold text-lg">{memory.title}</h2>
              <p className="text-sm text-gray-500">{memory.date}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedMemory && (
        <div className="fixed inset-0 bg-gradient-to-b from-pink-100 to-purple-100 bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full overflow-hidden shadow-2xl relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-2xl z-50"
              onClick={() => setSelectedMemory(null)}>
              ×
            </button>

            <div className="p-6">
              <h2 className="font-bold text-3xl mb-2 text-purple-700">
                {selectedMemory.title}
              </h2>
              <p className="text-gray-700 text-lg mb-2">
                {selectedMemory.description}
              </p>
              <p className="text-gray-400 text-sm">{selectedMemory.date}</p>
            </div>
          </div>
        </div>
      )}
      <Link
        href="/"
        className="m-5 px-4 py-2 bg-purple-400 rounded-full text-white font-bold hover:bg-purple-300 transition">
        Back Home
      </Link>
    </div>
  );
}
