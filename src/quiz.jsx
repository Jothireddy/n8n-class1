import React, { useState } from "react";

// ----------------------------------------------------------------------
// 1. The FULL React code for the Quiz Component
// ----------------------------------------------------------------------
const QUIZ_CODE = `
import React, { useEffect, useState } from "react";

const WEBHOOK = "https://admin.rigal.in/webhook/quizblog";

const SAMPLE_QUIZ = {
  topic: "Sample Quiz",
  questions: [
    { id: 1, question: "Fallback Q1?", options: ["A", "B", "C"], answer: "A", difficulty: "easy" },
    { id: 2, question: "Fallback Q2?", options: ["X", "Y", "Z"], answer: "Y", difficulty: "medium" },
  ],
};

// --- Helper to parse JSON safely ---
function extractJSONFromString(str) {
  if (typeof str !== "string") return null;
  const first = str.indexOf("{");
  const last = str.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) return null;
  try {
    return JSON.parse(str.slice(first, last + 1));
  } catch {
    return null;
  }
}

export default function App() {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [topic, setTopic] = useState("");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  async function fetchQuizWithTopic(t) {
    setLoading(true);
    setError(null);
    setQuiz(null);

    try {
      const res = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: t }),
      });

      if (!res.ok) {
        // Corrected line below
        throw new Error("HTTP error ${res.status}");
      }

      const data = await res.json();
      console.log("Webhook raw response:", data);

      let quizObj = null;

      if (Array.isArray(data)) {
        for (const item of data) {
          const content =
            item?.message?.content ??
            item?.choices?.[0]?.message?.content ??
            item?.choices?.[0]?.text ??
            item?.content ??
            null;

          if (content) {
            const parsed = extractJSONFromString(content);
            if (parsed?.topic && Array.isArray(parsed.questions)) {
              quizObj = parsed;
              break;
            }
          }
        }
      } else if (data?.message?.content) {
        const parsed = extractJSONFromString(data.message.content);
        if (parsed?.topic && Array.isArray(parsed.questions)) {
          quizObj = parsed;
        }
      } else if (data?.topic && Array.isArray(data.questions)) {
        quizObj = data;
      }

      if (!quizObj) {
        throw new Error("Unexpected response shape from webhook (see console).");
      }

      setQuiz(quizObj);
    } catch (err) {
      console.error(err);
      setError("Failed to load quiz — using sample. (" + err.message + ")");
      setQuiz(SAMPLE_QUIZ);
    } finally {
      setLoading(false);
    }
  }

  // Load sample on first render
  useEffect(() => {
    setQuiz(SAMPLE_QUIZ);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (quiz) {
      setAnswers({});
      setIndex(0);
      setSubmitted(false);
      setScore(0);
    }
  }, [quiz]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900 text-white">
        <div className="text-center">
          <div className="text-4xl font-semibold mb-4">Loading quiz...</div>
          <div className="opacity-70">Please wait...</div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 rounded-lg shadow-md bg-white text-center">
          <h2 className="text-2xl font-bold text-gray-800">Quiz Generator</h2>
          <p className="mt-2 text-gray-600">Enter a topic below to generate a new quiz!</p>
          <div className="mt-6 flex items-center gap-3">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Java"
              className="px-3 py-2 rounded-lg border bg-white w-full focus:ring-2 focus:ring-purple-400"
              disabled={loading}
            />
            <button
              onClick={() => { if (topic?.trim()) fetchQuizWithTopic(topic.trim()); }}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:bg-gray-400"
              disabled={loading || !topic.trim()}
            >
              Generate
            </button>
          </div>
          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        </div>
      </div>
    );
  }

  const total = quiz.questions.length;
  const current = quiz.questions[index];
  const allAnswered = Object.keys(answers).length === total;

  function selectOption(questionId, option) {
    if (submitted) return;
    setAnswers((s) => ({ ...s, [questionId]: option }));
  }

  function goNext() {
    setIndex((i) => Math.min(i + 1, total - 1));
  }
  function goPrev() {
    setIndex((i) => Math.max(i - 1, 0));
  }

  function handleSubmit() {
    let correct = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  }

  function resetQuiz() {
    setAnswers({});
    setIndex(0);
    setSubmitted(false);
    setScore(0);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
              {quiz?.topic?.toUpperCase() || "QUIZ TIME"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">A quiz generated just for you.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Generate another..."
              className="px-3 py-2 rounded-lg border bg-white w-full focus:ring-2 focus:ring-purple-400"
              disabled={loading}
            />
            <button
              onClick={() => { if (topic?.trim()) fetchQuizWithTopic(topic.trim()); }}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:bg-gray-400"
              disabled={loading || !topic.trim()}
            >
              Go
            </button>
          </div>
        </header>

        <main>
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 overflow-hidden">
            <div className="mb-6">
              <p className="text-sm text-gray-500 text-right mb-2">
                Question {index + 1} of {total}
              </p>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
                  style={{ width: "${((index + 1) / total) * 100}%" }}
                />
              </div>
            </div>

            <div key={current.id}>
              <h2 className="text-lg md:text-xl font-bold mb-2 text-gray-800">
                {current.question}
              </h2>
              <p className="text-sm text-gray-400 mb-4 capitalize">
                Difficulty: {current.difficulty || "unknown"}
              </p>
              <div className="grid gap-3 md:gap-4">
                {current.options.map((opt) => {
                  const selected = answers[current.id] === opt;
                  const isCorrect = submitted && opt === current.answer;
                  const isWrongSelected = submitted && selected && !isCorrect;
                  let buttonClass =
                    "w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center justify-between ";
                  if (submitted) {
                    if (isCorrect) buttonClass += "bg-green-100 border-green-300 ring-2 ring-green-300";
                    else if (isWrongSelected) buttonClass += "bg-red-100 border-red-300 ring-2 ring-red-300";
                    else buttonClass += "bg-gray-100 border-transparent opacity-70";
                  } else {
                    if (selected) buttonClass += "bg-purple-50 border-purple-400 ring-2 ring-purple-400";
                    else buttonClass += "bg-gray-50 border-transparent hover:bg-gray-100";
                  }
                  return (
                    <button
                      key={opt}
                      onClick={() => selectOption(current.id, opt)}
                      className={buttonClass}
                      disabled={submitted}
                    >
                      <span className="font-medium text-gray-700">{opt}</span>
                      {submitted && isCorrect && <span className="text-green-600 font-bold">✔</span>}
                      {submitted && isWrongSelected && <span className="text-red-500 font-bold">✖</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <footer className="mt-8 pt-6 border-t flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={goPrev} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium disabled:opacity-50" disabled={index === 0}>Prev</button>
                <button onClick={goNext} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium disabled:opacity-50" disabled={index === total - 1}>Next</button>
              </div>
              <div className="flex items-center gap-3">
                {!submitted ? (
                  <button onClick={handleSubmit} className="px-5 py-2 rounded-lg font-semibold text-white transition-shadow bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed" disabled={!allAnswered}>
                    Submit
                  </button>
                ) : (
                  <button onClick={resetQuiz} className="px-5 py-2 rounded-lg font-semibold text-purple-700 bg-purple-100 hover:bg-purple-200">
                    Try Again
                  </button>
                )}
              </div>
            </footer>

            {submitted && (
              <div className="mt-6 bg-gray-50 p-4 rounded-xl border text-center">
                <div className="text-sm text-gray-600">Final Score</div>
                <div className="text-3xl font-bold text-gray-800">
                  {score} / {total} ({Math.round((score / total) * 100)}%)
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
`;

// ----------------------------------------------------------------------
// 2. The full text for the AI System Prompt
// ----------------------------------------------------------------------
const PROMPT_TEXT = `
You are a Quiz Generator AI assistant. Your task is to generate 5–10 multiple-choice questions (MCQs) for a given topic in a *strict JSON format* that can be used directly by a frontend application.

Instructions:

1. Input: A single topic as a string.
2. Output:
   - 5–10 MCQs related to the topic.
   - Each question must have exactly 4 options labeled as A, B, C, D.
   - Each question must have *exactly one correct answer*.
   - Each question must include a "difficulty" field: "easy", "medium", or "hard".
   - Provide a unique numeric "id" for each question starting from 1.
3. Format: The output must strictly follow this JSON structure:

{
  "topic": "<topic>",
  "questions": [
    {
      "id": 1,
      "question": "string",
      "options": [
        "string",
        "string",
        "string",
        "string"
      ],
      "answer": "string",  // must exactly match one of the options
      "difficulty": "easy|medium|hard"
    },
    ...
  ]
}

4. Rules:
   - Do *not* include explanations, notes, or extra text outside JSON.
   - Questions must be clear, concise, and grammatically correct.
   - Options must be unique and relevant to the question.
   - Avoid ambiguous or opinion-based questions.
   - Difficulty should reflect the complexity of the question.
   - Ensure the JSON is valid (parsable) and properly structured.

5. Example Output (Topic: Solar System):

{
  "topic": "Solar System",
  "questions": [
    {
      "id": 1,
      "question": "Which planet is known as the Red Planet?",
      "options": ["Earth", "Mars", "Venus", "Jupiter"],
      "answer": "Mars",
      "difficulty": "easy"
    },
    {
      "id": 2,
      "question": "Which is the largest planet in our solar system?",
      "options": ["Jupiter", "Saturn", "Neptune", "Earth"],
      "answer": "Jupiter",
      "difficulty": "easy"
    }
  ]
}
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
export default function CodeDisplay() {
  return (
    <div className="min-h-screen w-full bg-gray-800 flex flex-col lg:flex-row items-center justify-center gap-8 p-4 lg:p-8">
      <Editor
        title="📝 quiz.jsx - React Code"
        initialContent={QUIZ_CODE}
        language="green"
      />
      <Editor
        title="🤖 AI System Prompt"
        initialContent={PROMPT_TEXT}
        language="sky"
      />
    </div>
  );
}

