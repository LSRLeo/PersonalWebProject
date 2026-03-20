import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";


//import Gemini API key from .env file
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);


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
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Turn the following statement into a professional and engaging LinkedIn post. 
      Only return the LinkedIn post, nothing else.
      Statement: ${input}`;
      const result = await model.generateContent(prompt);
      setPost(result.response.text());
    } catch (err) {
      setError("Something went wrong. Please try again.");
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