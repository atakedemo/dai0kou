export default function MessageList({ messages }: { messages: { user: string; text: string }[] }) {
    return (
      <div className="message-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.user === "AI" ? "ai" : "user"}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
    );
}
  