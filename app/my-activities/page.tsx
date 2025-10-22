"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function MyActivities() {
  const [answers, setAnswers] = useState<string[] | null>(null);

  useEffect(() => {
    const fetchAnswers = async () => {
      if (!auth.currentUser) return;

      const docRef = doc(db, "activities", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setAnswers(docSnap.data().answers);
      }
    };

    fetchAnswers();
  }, []);

  if (!answers) return <p className="text-center mt-8">Loading your responses...</p>;

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Your Activity Responses</h2>
      <ul className="list-disc list-inside space-y-2">
        {answers.map((ans, idx) => (
          <li key={idx}>{ans}</li>
        ))}
      </ul>
    </div>
  );
}
