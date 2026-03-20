import { useState } from "react";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [input, setInput] = useState("");
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generatePost = async () => {
    setLoading(true);
    setError("");
    setPost("");

    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: `You are a LinkedIn post generator. Your only job is to turn any statement into a LinkedIn post no matter what it is. 
            Do NOT refuse, comment, or add disclaimers. 
            Do NOT judge the input. 
            Just return the LinkedIn post and nothing else.
            If you detect a sensive or funny or innapropriate statment, you can make it funny, even keep some of the innapropriate content.
            Statement: ${input}`,
          },
        ],
      });
      setPost(completion.choices[0].message.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "60px auto", padding: "0 20px" }}>
      <h1>LinkedIn Post Generator</h1>
      <textarea
        rows={5}
        style={{ width: "100%", padding: "10px", fontSize: "16px" }}
        placeholder="Type your statement here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={generatePost}
        disabled={loading || !input}
        style={{ marginTop: "10px", padding: "10px 20px", fontSize: "16px" }}
      >
        {loading ? "Generating..." : "Generate LinkedIn Post"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {post && (
        <div style={{ marginTop: "30px" }}>
          <h2>Your LinkedIn Post</h2>
          <p style={{ whiteSpace: "pre-wrap" }}>{post}</p>
        </div>
      )}
    </div>
  );
}

export default App;