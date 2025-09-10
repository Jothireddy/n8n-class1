import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

// Default starter code
const sampleCode = `import React, { useState } from 'react';

export default function App() {
  const [heading, setHeading] = useState('Welcome to the Sandbox!');
  return (
    <div className="flex items-center justify-center h-full bg-gray-100 font-sans p-4">
      <div className="text-center p-10 bg-white rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800">{heading}</h1>
        <p className="mt-3 text-lg text-gray-600">
          You can edit this code and see live updates!
        </p>
      </div>
    </div>
  );
}
`;

export default function ReactSandbox() {
  const [code, setCode] = useState(sampleCode);
  const [err, setErr] = useState("");
  const [babelLoaded, setBabelLoaded] = useState(false);

  // Load Babel dynamically
  useEffect(() => {
    if (document.getElementById("babel-standalone-script")) {
      setBabelLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "babel-standalone-script";
    script.src = "https://unpkg.com/@babel/standalone/babel.min.js";
    script.async = true;
    script.onload = () => setBabelLoaded(true);
    script.onerror = () =>
      setErr("Critical Error: Could not load Babel. Sandbox will not work.");
    document.body.appendChild(script);
  }, []);

  // Compile and run React code
  const compileAndRun = (newCode) => {
    if (!window.Babel) {
      setErr("Babel is not yet available. Please wait a moment.");
      return;
    }

    try {
      setErr("");

      // Transform React imports to use global React
      let transformedCode = newCode.replace(
        /import\s+(React)?(?:,\s*)?(\{[\s\S]*?\})?\s+from\s+['"]react['"]/g,
        (match, defaultImport, namedImports) => {
          let replacement = "";
          if (defaultImport) replacement += "const React = window.React; ";
          if (namedImports) {
            const names = namedImports.replace(/\{|\}/g, "").trim();
            replacement += `const { ${names} } = window.React;`;
          }
          return replacement;
        }
      );

      // Replace export default with global variable
      if (!/export\s+default/.test(transformedCode)) {
        throw new Error(
          "No default export found. Your component must include 'export default'."
        );
      }
      transformedCode = transformedCode.replace(
        /export\s+default\s+/,
        "window.__SANDBOX_DEFAULT_EXPORT__ = "
      );

      // Transpile JSX and modern JS using Babel
      const transpiled = window.Babel.transform(transformedCode, {
        presets: [["env", { modules: false }], "react"],
      }).code;

      // Prepare code to run inside iframe
      const codeToRun = `
        ${transpiled}
        const ComponentToRender = window.__SANDBOX_DEFAULT_EXPORT__;
        const container = document.getElementById('sandbox-root');
        if (container) {
          const root = ReactDOM.createRoot(container);
          if (ComponentToRender) {
            if (typeof ComponentToRender === 'function' || (typeof ComponentToRender === 'object' && ComponentToRender.$$typeof)) {
              root.render(React.createElement(ComponentToRender));
            } else {
              throw new Error('Default export is not a valid React component.');
            }
          } else {
            throw new Error('Default export evaluated to undefined.');
          }
        } else {
          throw new Error('Root element #sandbox-root not found.');
        }
      `;

      // Write code into iframe
      const iframe = document.getElementById("sandbox-frame");
      if (!iframe) return;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(`
        <div id="sandbox-root"></div>
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          try {
            ${codeToRun}
          } catch(e) {
            document.body.innerHTML = '<pre style="color:red; padding:1rem; font-family: monospace;">' + e.stack + '</pre>';
          }
        </script>
      `);
      iframeDoc.close();
    } catch (e) {
      setErr(e.message || "An unknown error occurred.");
    }
  };

  // Compile whenever code changes
  useEffect(() => {
    if (!babelLoaded) return;
    const handler = setTimeout(() => compileAndRun(code), 500);
    return () => clearTimeout(handler);
  }, [code, babelLoaded]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen font-sans bg-gray-100">
      {/* Code Editor */}
      <div className="flex flex-col h-full border-r border-gray-300 shadow-lg">
        <header className="p-4 bg-gray-900 text-white font-semibold shadow-md flex items-center justify-between">
          <span>💻 React Code Editor</span>
        </header>
        <div className="flex-grow overflow-auto">
          <CodeMirror
            value={code}
            height="100%"
            theme="dark"
            extensions={[javascript({ jsx: true })]}
            onChange={(value) => setCode(value)}
            className="text-sm"
          />
        </div>
        {err && (
          <div className="p-4 bg-red-600 text-white font-mono text-sm shadow-inner">
            {err}
          </div>
        )}
      </div>

      {/* Live Preview */}
      <div className="flex flex-col h-full shadow-lg">
        <header className="p-4 bg-gray-200 text-gray-800 font-semibold shadow-md flex items-center justify-between">
          <span>⚡ Live Preview</span>
        </header>
        {!babelLoaded ? (
          <div className="flex items-center justify-center h-full flex-grow">
            <p className="text-gray-500 animate-pulse text-lg">
              Preparing Sandbox Environment...
            </p>
          </div>
        ) : (
          <iframe
            id="sandbox-frame"
            title="sandbox"
            className="w-full flex-grow border-0 bg-white"
            sandbox="allow-scripts allow-same-origin"
          />
        )}
      </div>
    </div>
  );
}
