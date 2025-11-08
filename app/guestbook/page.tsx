"use client";

import { useState } from "react";
import { MessageCircleHeart } from "lucide-react";

export default function GuestbookWidget() {
  const [isOpen, setIsOpen] = useState(false);

  // 🩷 Энд өөрийн мэндчилгээний үгээ бичнэ
  const greeting =
    "Happy Birthday to the most wonderful person! 🎂💖 Wishing you love, laughter, and every happiness today and always.";

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-400 to-purple-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300"
      >
        <MessageCircleHeart size={24} />
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl p-8 text-center w-[90%] max-w-md animate-fadeIn"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              💌 Random one to special person
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {greeting}
            </p>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-6 bg-gradient-to-r from-pink-400 to-purple-500 text-white px-6 py-2 rounded-full hover:scale-105 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
