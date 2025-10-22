"use client";

import { motion } from "framer-motion";

export default function BirthdayCardButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-pink-500 text-white px-6 py-3 rounded-lg shadow hover:bg-pink-600 transition"
    >
      💌 Open Birthday Message
    </motion.button>
  );
}
