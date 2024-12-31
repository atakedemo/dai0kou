"use client";

import { useState } from "react";
import ChatForm from "@/components/ChatForm";
import MessageList from "@/components/MessageList";

export default function Page() {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);

  const handleSend = async (message: string) => {
    setMessages((prev) => [...prev, { user: "You", text: message }]);

    try {
      const response = await fetch("/api/writer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      console.log(data)
      const data2 = data.response;
      const aiResponse =
        JSON.parse(data2).candidates?.[0]?.content?.parts?.[0]?.text || "AIからの応答がありません。";
      console.log(aiResponse)

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [...prev, { user: "AI", text: aiResponse }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [...prev, { user: "AI", text: "エラーが発生しました。" }]);
    }
  };

  return (
    <div>
      <MessageList messages={messages} />
      <ChatForm onSend={handleSend} />
    </div>
  );
}