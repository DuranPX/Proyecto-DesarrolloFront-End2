// src/components/Chatbot.tsx
import React, { useState } from "react";
import { sendMessageToGemini } from "../services/geminiApiServices";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" } as const;
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const botReply = await sendMessageToGemini(input);
    setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
    setLoading(false);
  };

  return (
    <div className="p-4 border border-gray-700 rounded w-full max-w-md mx-auto bg-black text-white shadow-lg">
        <h2 className="text-xl font-bold mb-3 text-white text-center">ChatDEV</h2>

        <div className="h-64 overflow-y-auto border border-gray-700 rounded p-3 mb-3 bg-gray-900">
            {messages.map((msg, idx) => (
            <div
                key={idx}
                className={`mb-2 text-sm p-2 rounded max-w-[80%] ${
                msg.sender === "user"
                    ? "bg-blue-600 text-white ml-auto text-right"
                    : "bg-gray-700 text-white mr-auto text-left"
                }`}
            >
                {msg.text}
            </div>
            ))}
            {loading && (
            <div className="text-gray-400 text-sm italic">Pensando...</div>
            )}
        </div>

        <div className="flex gap-2">
            <input
            className="flex-1 border border-gray-700 rounded px-3 py-2 text-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribe tu mensaje..."
            />
            <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded transition duration-200"
            onClick={handleSend}
            >
            Enviar
            </button>
        </div>
    </div>

  );
};

export default Chatbot;
