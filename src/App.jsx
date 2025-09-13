// ---------- FILE: src/App.jsx ----------
import { useState } from "react";
import ReactSandbox from "./ReactSandbox";
import Credentials from "./credentials";
import Chatbot from "./webhook";
import QuizApp from "./quiz";
import StoryApp from "./story";
import Round1 from "./Round1"; // ✅ Keep file name as Round1

export default function App() {
  const [page, setPage] = useState("home");

  const navItems = [
    { key: "home", label: "Home" },
    { key: "sandbox", label: "React Compiler" },
    { key: "credentials", label: "Credentials" },
    { key: "chatbot", label: "Chatbot" },
    { key: "quiz", label: "Quiz" },
    { key: "story", label: "Story" },
    { key: "round1", label: "Hackathon" }, // ✅ Only changed label
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 text-white shadow-md">
        <div className="container mx-auto flex items-center justify-between py-3 px-6">
          <h1 className="text-xl font-bold">⚡ Dev Playground</h1>
          <nav className="flex space-x-3">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setPage(item.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  page === item.key
                    ? "bg-blue-600 shadow-lg"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 w-full">
        {page === "home" && (
          <div className="w-full max-w-2xl">
            <div className="bg-white shadow-lg rounded-2xl p-10 text-center space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">
                👋 Welcome to Dev Playground
              </h2>
              <p className="text-gray-600 text-lg">
                Use the navigation bar above to explore the different tools,
                including the React Compiler, Chatbot, Quiz, Story Generator,
                and Hackathon Challenges.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                {/* Buttons */}
                <button
                  onClick={() => setPage("sandbox")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition"
                >
                  React Compiler
                </button>
                <button
                  onClick={() => setPage("credentials")}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition"
                >
                  Credentials
                </button>
                <button
                  onClick={() => setPage("chatbot")}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg shadow-md transition"
                >
                  Chatbot
                </button>
                <button
                  onClick={() => setPage("quiz")}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-lg shadow-md transition"
                >
                  Quiz
                </button>
                <button
                  onClick={() => setPage("story")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow-md transition"
                >
                  Story
                </button>
                <button
                  onClick={() => setPage("round1")}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg shadow-md transition"
                >
                  Hackathon {/* ✅ Button title changed */}
                </button>
              </div>
            </div>
          </div>
        )}

        {page === "sandbox" && <ReactSandbox />}
        {page === "credentials" && <Credentials />}
        {page === "chatbot" && <Chatbot />}
        {page === "quiz" && <QuizApp />}
        {page === "story" && <StoryApp />}
        {page === "round1" && <Round1 />} {/* ✅ Still points to Round1.jsx */}
      </main>
    </div>
  );
}
