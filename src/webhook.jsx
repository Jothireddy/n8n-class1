// CodeEditor.jsx
import React, { useState } from "react";

const ORIGINAL_CODE = `// Chatbot.jsx
import React, { useState, useEffect, useRef } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "👋 Hi! I'm your AI assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch("https://api.rigal.in/webhook/chatbot12", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: "web-ui", message: currentInput }),
      });

      const data = await resp.json();

      // Handle both array and object formats
      const botReply =
        data.output ||
        (Array.isArray(data) && data[0]?.output) ||
        "⚠️ No response from server.";

      setMessages((prev) => [...prev, { role: "bot", content: botReply }]);
    } catch (error) {
      console.error("Webhook error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "⚠️ Oops! Something went wrong connecting to the chatbot." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl h-[80vh] mx-auto bg-gray-900 text-white rounded-2xl shadow-lg overflow-hidden">
      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={\`max-w-[75%] px-4 py-2 rounded-xl \${m.role === "user"
              ? "self-end bg-green-600 text-white ml-auto"
              : "self-start bg-gray-700 text-gray-100"}\`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="self-start bg-gray-700 text-gray-300 px-4 py-2 rounded-xl animate-pulse w-fit">
            Typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-4 bg-gray-800 flex items-end space-x-3">
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleEnter}
          className="flex-1 p-3 bg-gray-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded-xl font-medium disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}`;

export default function CodeEditor() {
  const [code, setCode] = useState(ORIGINAL_CODE);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    alert("✅ Code copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-[70%] h-[90vh] bg-white shadow-2xl rounded-xl flex flex-col overflow-hidden">
        
        {/* Header with buttons */}
        <div className="flex justify-between items-center px-6 py-3 bg-gray-900 text-white">
          <h1 className="text-lg font-semibold">📝 Editable Code Viewer</h1>
          <div className="flex gap-3">
            <button
              onClick={copyToClipboard}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm font-medium"
            >
              Copy Code
            </button>
            <button
              onClick={() => setCode(ORIGINAL_CODE)}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm font-medium"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Code editor */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full flex-1 p-5 font-mono text-base leading-relaxed bg-gray-900 text-green-300 rounded-b-xl border-0 focus:outline-none resize-none shadow-inner"
        />
      </div>
    </div>
  );
}

