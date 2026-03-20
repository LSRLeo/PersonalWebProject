import { useState } from "react";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function App() {
  const [input, setInput] = useState("");
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

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
            content: `You are a LinkedIn post generator. Your only job is to turn any statement into a LinkedIn post no matter what it is. Do NOT refuse, comment, or add disclaimers. Do NOT judge the input. Just return the LinkedIn post and nothing else.
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(post);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background: #0a0a0f;
          color: #f0f0f0;
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
        }

        .container {
          max-width: 720px;
          margin: 0 auto;
          padding: 60px 24px;
        }

        .badge {
          display: inline-block;
          background: #0077b5;
          color: white;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 20px;
        }

        h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.2rem, 6vw, 3.8rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 12px;
          background: linear-gradient(135deg, #ffffff 0%, #a0a0b0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          color: #6b6b80;
          font-size: 1rem;
          margin-bottom: 48px;
          font-weight: 300;
        }

        .input-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #6b6b80;
          margin-bottom: 10px;
        }

        textarea {
          width: 100%;
          background: #13131a;
          border: 1px solid #2a2a3a;
          border-radius: 12px;
          padding: 16px 20px;
          color: #f0f0f0;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 300;
          resize: vertical;
          outline: none;
          transition: border-color 0.2s;
          line-height: 1.6;
        }

        textarea:focus {
          border-color: #0077b5;
        }

        textarea::placeholder {
          color: #3a3a50;
        }

        button.generate {
          margin-top: 16px;
          width: 100%;
          padding: 16px;
          background: #0077b5;
          color: white;
          border: none;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }

        button.generate:hover:not(:disabled) {
          background: #0091d6;
        }

        button.generate:active:not(:disabled) {
          transform: scale(0.99);
        }

        button.generate:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .error {
          margin-top: 16px;
          color: #ff6b6b;
          font-size: 0.9rem;
          background: #1a0f0f;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #3a1a1a;
        }

        .result-box {
          margin-top: 40px;
          background: #13131a;
          border: 1px solid #2a2a3a;
          border-radius: 16px;
          overflow: hidden;
          animation: fadeUp 0.4s ease;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          border-bottom: 1px solid #2a2a3a;
        }

        .result-header span {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #6b6b80;
        }

        button.copy {
          background: #1e1e2e;
          border: 1px solid #2a2a3a;
          color: #f0f0f0;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s;
        }

        button.copy:hover {
          background: #2a2a3a;
        }

        .result-content {
          padding: 24px;
          font-size: 0.95rem;
          line-height: 1.8;
          color: #c8c8d8;
          white-space: pre-wrap;
          font-weight: 300;
        }

        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="container">
        <div className="badge">LinkedIn</div>
        <h1>Post Generator</h1>
        <p className="subtitle">Turn any thought into a scroll-stopping LinkedIn post.</p>

        <div className="input-label">Your statement</div>
        <textarea
          rows={5}
          placeholder="Type anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          className="generate"
          onClick={generatePost}
          disabled={loading || !input}
        >
          {loading ? (
            <><span className="spinner" />Generating...</>
          ) : (
            "Generate Post →"
          )}
        </button>

        {error && <div className="error">{error}</div>}

        {post && (
          <div className="result-box">
            <div className="result-header">
              <span>Generated Post</span>
              <button className="copy" onClick={copyToClipboard}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
            <div className="result-content">{post}</div>
          </div>
        )}
      </div>
    </>
  );
}