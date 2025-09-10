// src/Credentials.jsx
import React from "react";

export default function Credentials() {
  const class1 = {
    name: "Hafeez",
    email: "haffexahmed9700@gmail.com",
    password: "Nandhu@123",
    ip: "http://34.47.133.254:5678/",
  };

  const class2 = {
    name: "Jayakrishna",
    email: "jayakrishna5341@gmail.com",
    password: "Nandhu@123",
    ip: "http://35.200.134.36:5678/",
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold mb-4">Class Credentials</h1>

      {/* Class1 Section */}
      <div className="p-4 bg-white rounded shadow w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-2">Class1: {class1.name}</h2>
        <p><strong>Email:</strong> {class1.email}</p>
        <p><strong>Password:</strong> {class1.password}</p>
        <p><strong>n8n IP Address:</strong> {class1.ip}</p>
      </div>

      {/* Class2 Section */}
      <div className="p-4 bg-white rounded shadow w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-2">Class2: {class2.name}</h2>
        <p><strong>Email:</strong> {class2.email}</p>
        <p><strong>Password:</strong> {class2.password}</p>
        <p><strong>n8n IP Address:</strong> {class2.ip}</p>
      </div>
    </div>
  );
}
