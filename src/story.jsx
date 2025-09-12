import React, { useState } from "react";

// ----------------------------------------------------------------------
// 1. The FULL React code for the Story Generator Component
// ----------------------------------------------------------------------
const STORY_CODE = `
// FILE: src/story.jsx
import React, { useState } from "react";

// Webhook URL (backend already has system prompt)
const WEBHOOK = "https://api.rigal.in/webhook/story";

export default function App() {
  const [genre, setGenre] = useState("");
  const [keywords, setKeywords] = useState(""); // e.g. "castle, dragon, sword"
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function buildTopicString(g, kwsArray) {
    // Example format: "Mystery: castle, dragon, sword"
    return \`\${g.trim()}: \${kwsArray.map(s => s.trim()).join(", ")}\`;
  }

  async function handleSend() {
    setError(null);
    setStory("");

    const g = (genre || "").trim();
    const kws = (keywords || "").split(",").map(k => k.trim()).filter(Boolean);

    if (!g) {
      setError("Please enter a genre.");
      return;
    }
    if (kws.length !== 3) {
      setError("Please enter exactly 3 comma-separated keywords (e.g. castle, dragon, sword).");
      return;
    }

    const topic = buildTopicString(g, kws);
    setLoading(true);

    try {
      const res = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }), // <-- single field only
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(\`HTTP \${res.status} - \${txt}\`);
      }

      // try common response shapes, else raw text
      let textBody = null;
      try {
        const data = await res.json();
        if (typeof data === "string") textBody = data;
        else if (data.story && typeof data.story === "string") textBody = data.story;
        else if (data.output && typeof data.output === "string") textBody = data.output;
        else if (Array.isArray(data)) {
          for (const item of data) {
            const content = item?.choices?.[0]?.message?.content ?? item?.choices?.[0]?.text ?? item?.content ?? null;
            if (content && typeof content === "string") { textBody = content; break; }
            if (typeof item === "string") { textBody = item; break; }
          }
        } else if (data.choices && Array.isArray(data.choices)) {
          const c = data.choices[0];
          textBody = c?.message?.content ?? c?.text ?? null;
        } else {
          // pick any long string field
          for (const k of Object.keys(data)) {
            if (typeof data[k] === "string" && data[k].length > 20) { textBody = data[k]; break; }
          }
        }
      } catch (e) {
        // not JSON — read as text
        textBody = await res.text().catch(() => null);
      }

      if (!textBody) throw new Error("Empty or unexpected response from webhook.");

      // strip triple-backticks or leading "Story:" label if assistant included them
      const fence = textBody.match(/(?:[a-zA-Z0-9_-]+)?\\n([\\s\\S]*?)/);
      const candidate = fence ? fence[1].trim() : textBody.trim();
      const cleaned = candidate.replace(/^Story:\\s*/i, "").trim();

      setStory(cleaned);
    } catch (err) {
      console.error(err);
      setError("Failed to send topic or parse response. " + (err.message || ""));
      setStory(""); // keep empty or optionally show a fallback
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-indigo-700 mb-4">✨ Story Generator — send single topic</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="e.g., Mystery"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (comma-separated, exactly 3)</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="castle, dragon, sword"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-300"
            />
            <p className="text-xs text-gray-500 mt-1">Will be sent as a single topic string to the backend.</p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSend}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Topic"}
            </button>

            <button
              type="button"
              onClick={() => { setGenre(""); setKeywords(""); setStory(""); setError(null); }}
              className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Clear
            </button>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
        </div>

        {story && (
          <div className="mt-6 bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-indigo-700 mb-2">📖 Story</h2>
            <div className="prose max-w-none whitespace-pre-line text-gray-800">{story}</div>
          </div>
        )}
      </div>
    </div>
  );
}
`;

// ----------------------------------------------------------------------
// 2. The full text for the AI System Prompt
// ----------------------------------------------------------------------
const PROMPT_TEXT = `
You are a creative story generator for students. Input will provide a genre and exactly three keywords. Produce a single short story in plain text that:

- Clearly reflects the given genre and incorporates the three keywords naturally (not just listed).
- Is between ~200 and 500 words (concise but satisfying).
- Builds a believable scene and character(s) and leads to a surprise twist ending revealed in the final 1–2 sentences.
- The twist must be logically foreshadowed (no impossible deus ex machina) but still surprising.
- Use clear, age-appropriate language suitable for middle/high school students; avoid graphic violence, explicit sexual content, hate speech, or illegal instructions.
- Do not output JSON, metadata, or explanatory text — return only the story text itself.
- Keep paragraphs short (1–3 sentences) for readability.

If the input is missing or unclear, politely generate a short, family-friendly story in the provided genre using the three keywords anyway.
`;

// ----------------------------------------------------------------------
// 3. A reusable Editor component to display the content
// ----------------------------------------------------------------------
function Editor({ title, initialContent, language = "green" }) {
  const [content, setContent] = useState(initialContent.trim());
  const [copyButtonText, setCopyButtonText] = useState("Copy");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopyButtonText("✅ Copied!");
    setTimeout(() => setCopyButtonText("Copy"), 2000);
  };

  const textColor = language === "green" ? "text-green-300" : "text-sky-300";

  return (
    <div className="w-full h-[90vh] bg-gray-900 shadow-2xl rounded-xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-3 bg-black bg-opacity-20 text-white border-b border-gray-700">
        <h1 className="text-lg font-semibold">{title}</h1>
        <div className="flex gap-3">
          <button
            onClick={copyToClipboard}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            {copyButtonText}
          </button>
          <button
            onClick={() => setContent(initialContent.trim())}
            className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-lg text-sm font-medium"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Textarea for content */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        spellCheck="false"
        className={`w-full flex-1 p-5 font-mono text-sm leading-relaxed bg-gray-900 rounded-b-xl border-0 focus:outline-none resize-none shadow-inner ${textColor}`}
      />
    </div>
  );
}

// ----------------------------------------------------------------------
// 4. Main component that renders both editors side-by-side
// ----------------------------------------------------------------------
export default function StoryCodeDisplay() {
  return (
    <div className="min-h-screen w-full bg-gray-800 flex flex-col lg:flex-row items-center justify-center gap-8 p-4 lg:p-8">
      <Editor
        title="📝 story.jsx - React Code"
        initialContent={STORY_CODE}
        language="green"
      />
      <Editor
        title="🤖 AI Story Prompt"
        initialContent={PROMPT_TEXT}
        language="sky"
      />
    </div>
  );
}
