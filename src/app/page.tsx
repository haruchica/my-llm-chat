"use client";

import { useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();

      if (data.chatAiReply) {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: data.chatAiReply,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "エラーが発生しました 🥲" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl border rounded-lg p-4 space-y-4">
        <h1 className="text-xl font-bold">LLM Chat Demo</h1>

        <div className="border rounded-md h-72 overflow-y-auto p-2 text-sm space-y-2 color-custom-bg-chatbox">
          {messages.length === 0 && (
            <p className="text-gray-400">メッセージを送信してみてください。</p>
          )}
          {messages.map((m, i) => (
            <div key={i}>
              <span className="font-semibold">
                {m.role === "user" ? "You: " : "AI: "}
              </span>
              <span>{m.content}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 border rounded-md px-2 py-1 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="質問を入力..."
          />
          <button
            className="border rounded-md px-3 py-1 text-sm"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? "送信中..." : "送信"}
          </button>
        </div>
      </div>
    </main>
  );
}