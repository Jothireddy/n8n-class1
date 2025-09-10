// App.jsx
import { useState } from "react";
import ReactSandbox from "./ReactSandbox";
import Credentials from "./credentials";

export default function App() {
  const [page, setPage] = useState("home");

  const navItems = [
    { key: "home", label: "Home" },
    { key: "sandbox", label: "React Compiler" },
    { key: "credentials", label: "Credentials" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      {/* Navigation */}
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
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        {page === "home" && (
          <div className="w-full max-w-xl">
            <div className="bg-white shadow-lg rounded-2xl p-10 text-center space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">👋 Welcome to Dev Playground</h2>
              <p className="text-gray-600 text-lg">
                Use the navigation bar above to explore the React Compiler or view credentials.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
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
              </div>
            </div>
          </div>
        )}

        {page === "sandbox" && <ReactSandbox />}
        {page === "credentials" && <Credentials />}
      </main>
    </div>
  );
}
