"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import Header from "../components/header";

const questions = ["Сэтгэлийн үгээ бичиж болдог хэсэг (юу ч бичсэн болноо :) )"];

export default function ActivitiesPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDone = async () => {
    if (!user) return alert("Login required!");

    try {
      await setDoc(doc(db, "activities", user.uid), {
        answers,
        createdAt: serverTimestamp(),
        userEmail: user.email || "",
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Saving error:", error);
      alert("Error saving data.");
    }
  };

  // Loading үед хар цагаан дэлгэц гардаг асуудлыг зассан
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-700">
        Loading...
      </div>
    );
  }

  // Хэрэв login хийгээгүй бол login руу явуулна
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <p className="mb-4 text-gray-700 text-lg">Нэвтэрч байж энэхүү хэсэгт хандана.</p>
          <Link
            href="/login"
            className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-lg w-full space-y-4">
          <h2 className="text-3xl font-bold text-purple-600">Thank You 💜</h2>
          <p className="text-gray-600">Your answers have been saved.</p>
          <Link href="/" className="py-3 px-6 bg-purple-500 text-white rounded-xl hover:bg-purple-600 font-semibold">
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg text-center space-y-5">
          <h2 className="text-2xl font-bold text-gray-800">
            Step {currentStep + 1} / {questions.length}
          </h2>

          <p className="text-gray-700 text-lg">{questions[currentStep]}</p>
          <textarea
            className="w-full border rounded-xl p-3 h-28 text-gray-700 focus:outline-purple-400"
            value={answers[currentStep]}
            onChange={(e) => {
              const updated = [...answers];
              updated[currentStep] = e.target.value;
              setAnswers(updated);
            }}
            placeholder="Write your words of encouragement here..."
          />

          <div className="flex justify-between pt-4">
            {currentStep > 0 ? (
              <button onClick={() => setCurrentStep(currentStep - 1)} className="px-6 py-3 bg-gray-200 rounded-xl font-medium hover:bg-gray-300">
                Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < questions.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!answers[currentStep]}
                className="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold disabled:opacity-40"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleDone}
                disabled={!answers[currentStep]}
                className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold disabled:opacity-40"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
