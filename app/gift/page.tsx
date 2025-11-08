"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import ProtectedRoute from "../components/ProtectedRoute";
import Header from "../components/header";

const questions = [
  {
    question: "What gift would you like?",
    options: ["Book", "Game", "Clothes", "Gadget"],
  },
  { question: "Favorite color?", options: ["Red", "Blue", "Pink", "Green"] },
  {
    question: "Ideal weekend activity?",
    options: ["Movie", "Picnic", "Gaming", "Reading"],
  },
  {
    question: "Favorite sweet treat?",
    options: ["Chocolate", "Candy", "Cake", "Ice cream"],
  },
  {
    question: "Holiday destination?",
    options: ["Beach", "Mountains", "City", "Home"],
  },
];

export default function ActivitiesPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswer = (option: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = option;
    setAnswers(newAnswers);
  };

  const handleNext = () => setCurrentStep(currentStep + 1);
  const handleBack = () => setCurrentStep(currentStep - 1);

  const handleDone = async () => {
    if (!auth.currentUser) return alert("Please login first!");
    try {
      await setDoc(doc(db, "activities", auth.currentUser.uid), {
        answers,
        createdAt: serverTimestamp(),
        userEmail: auth.currentUser.email,
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Error saving your answers.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 px-4 py-16">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg text-center space-y-6">
          <h2 className="text-3xl font-bold text-purple-600">Thank You! 💜</h2>
          <p className="text-gray-600 text-lg">Your responses have been saved successfully.</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition"
          >
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 px-4 py-16">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Step {currentStep + 1} of {questions.length}
          </h2>
          <p className="text-gray-600 text-lg">{questions[currentStep].question}</p>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {questions[currentStep].options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`px-4 py-3 rounded-xl border transition-all text-sm md:text-base
                ${
                  answers[currentStep] === option
                    ? "bg-purple-500 text-white border-purple-500 shadow-md"
                    : "border-gray-300 hover:bg-purple-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            {currentStep > 0 ? (
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={answers[currentStep] === undefined}
                className="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-purple-600 transition"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleDone}
                disabled={answers[currentStep] === undefined}
                className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-green-600 transition"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
