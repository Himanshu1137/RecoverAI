import { useState } from "react";
import { chatWithAgent } from "../services/api";

function AIChat() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const result = await chatWithAgent(message);
      setAnswer(result.answer);
    } catch {
      setAnswer("Unable to connect to RecoverAI Agent.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="agent-card">
      <h2>RecoverAI Agent</h2>
      <p>Ask about failed payments, priorities, or recovery revenue.</p>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Which payments should I prioritize?"
        rows="4"
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
          }
        }}
      />

      <button onClick={sendMessage} disabled={loading}>
        {loading ? "Analyzing..." : "Ask RecoverAI"}
      </button>

      {answer && (
        <div className="agent-answer">
          <strong>RecoverAI</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default AIChat;
