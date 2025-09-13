// ---------- FILE: src/Round1.jsx ----------
import { motion } from "framer-motion";

export default function Round1() {
  const problemStatement = `🚀 Hackathon Problem Statement
AI-Powered Research Paper Generator (using n8n + OpenAI)

Context
Writing structured research papers is a tedious and time-consuming process. With the power of AI, we can automate the generation of professional research-style documents from just a single topic.

The Challenge
Your task is to design and build an AI Research Paper Generator in n8n that:
- Takes a single topic as input (e.g., Transformers in NLP).
- Uses OpenAI to split the topic into 5 fixed sections:
  1. Introduction & Motivation
  2. Background & Related Work
  3. Methods / Core Techniques
  4. Applications / Case Studies / System Architecture
  5. Discussion, Limitations & Future Directions
- Each section should be generated using a separate OpenAI node in n8n.
- Merge all the generated content into a single document.
- Export the final output as a stylish PDF, resembling a mini research publication.

Constraints
- Use only n8n inbuilt nodes and OpenAI credentials.
- No paid third-party APIs (other than OpenAI) are allowed.
- Time available: 12 hours.

Deliverables
- End-to-end n8n workflow that runs without errors.
- Input → Topic | Output → Generated PDF research paper.
- Screenshots of workflow + generated PDF.`;

  const renderProblem = (text) =>
    text.split("\n").map((line, i) =>
      line.trim() ? (
        <p key={i} className="text-gray-700 leading-relaxed mb-2">
          {line}
        </p>
      ) : (
        <br key={i} />
      )
    );

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-2xl p-10 space-y-10"
      >
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-5xl font-extrabold text-center text-indigo-700"
        >
          🚀 Hackathon Challenge
        </motion.h1>

        {/* Problem Statement */}
        <section>
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            📝 Problem Statement
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg border space-y-1">
            {renderProblem(problemStatement)}
          </div>
        </section>

        {/* Hackathon Rounds */}
        <section>
          <h2 className="text-2xl font-bold text-green-700 mb-6">
            🏆 Hackathon Rounds
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Round 1 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-xl bg-blue-50 border-l-4 border-blue-600 shadow space-y-3"
            >
              <h3 className="text-xl font-semibold text-blue-800">
                Round 1 – Understanding the Problem
              </h3>
              <p className="text-gray-700">
                By <strong>10:30 AM</strong>, submit a{" "}
                <span className="font-medium">Word Document</span> explaining
                your understanding and approach.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Your understanding of the problem statement</li>
                <li>Key requirements of the workflow</li>
                <li>Your planned approach and ideas</li>
              </ul>
              <motion.a
                href="https://forms.gle/c7SAjN8oL3tmJEBP8"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="block mt-4 px-5 py-2 rounded-lg text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md hover:shadow-xl transition"
              >
                📤 Submit Round 1
              </motion.a>
            </motion.div>

            {/* Round 2 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-xl bg-purple-50 border-l-4 border-purple-600 shadow space-y-3"
            >
              <h3 className="text-xl font-semibold text-purple-800">
                Round 2 – Progress Submission
              </h3>
              <p className="text-gray-700">
                By <strong>12:45 PM</strong>, submit your in-progress n8n
                workflow.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Nodes created for at least 2–3 sections</li>
                <li>Working connections between nodes</li>
                <li>Initial test outputs/screenshots</li>
              </ul>
              <motion.a
                href="https://forms.gle/VEbRc3ieweT1M14dA"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="block mt-4 px-5 py-2 rounded-lg text-center bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold shadow-md hover:shadow-xl transition"
              >
                📤 Submit Round 2
              </motion.a>
            </motion.div>

            {/* Round 3 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-xl bg-orange-50 border-l-4 border-orange-600 shadow space-y-3"
            >
              <h3 className="text-xl font-semibold text-orange-800">
                Round 3 – Final Submission
              </h3>
              <p className="text-gray-700">
                By <strong>4:00 PM</strong>, submit your final workflow & PDF.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Screenshot of the complete workflow</li>
                <li>Working demonstration of the run</li>
                <li>The generated <strong>styled PDF</strong></li>
              </ul>
              <motion.a
                href="https://forms.gle/6vwrQzXN2BtoWCkN6"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="block mt-4 px-5 py-2 rounded-lg text-center bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold shadow-md hover:shadow-xl transition"
              >
                📤 Submit Round 3
              </motion.a>
            </motion.div>
          </div>
        </section>

        {/* Submission Guidelines */}
        <section className="bg-gray-100 rounded-xl p-6 shadow-inner">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            📌 Submission Guidelines
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Follow the given timeline strictly.</li>
            <li>Work should be original – plagiarism is not allowed.</li>
            <li>Ensure the workflow is properly named and documented.</li>
            <li>
              Final submission must include{" "}
              <strong>screenshots + workflow + PDF</strong>.
            </li>
          </ul>
        </section>
      </motion.div>
    </div>
  );
}
