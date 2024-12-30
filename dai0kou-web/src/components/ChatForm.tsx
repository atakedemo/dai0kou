"use client";

import { useState } from "react";

export default function ChatForm({ onSend }: { onSend: (message: string) => void }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="要約したい文章を入れて！"
        className="input"
      />
      <button type="submit" className="btn">
        送信
      </button>
    </form>
  );
}