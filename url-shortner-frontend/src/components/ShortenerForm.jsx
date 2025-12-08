import React, { useState, useEffect } from "react";


export default function ShortenerForm() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load history from local storage
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("urlHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const [copied, setCopied] = useState(false);

  // Save history changes
  useEffect(() => {
    localStorage.setItem("urlHistory", JSON.stringify(history));
  }, [history]);

  const handleShorten = async () => {
    setError("");
    setShortUrl("");
    setLoading(true);

    if (!url.trim()) {
      setLoading(false);
      setError("Please enter a valid URL.");
      return;
    }

    try {
      const apiURL = import.meta.env.VITE_API_URL;

      const res = await fetch(`${apiURL}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }
       
      setShortUrl(data.shortURL);

      const newEntry = { long: url, short: data.shortURL };
      setHistory((prev) => [newEntry, ...prev]);
      setUrl("");

    } catch (err) {
      console.log(err);
      setLoading(false);
      setError("Failed to connect to server.");
    }
  };

  // ⭐ DELETE ALL HISTORY BUTTON FUNCTION
  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete ALL URLs from the database and history?")) return;

    try {
      const apiURL = import.meta.env.VITE_API_URL;

      const res = await fetch(`${apiURL}/urls`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to delete");
        return;
      }

      // Clear frontend history
      setHistory([]);
      localStorage.removeItem("urlHistory");

      alert("All URLs deleted successfully!");

    } catch (err) {
      console.log(err);
      alert("Server error while deleting.");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}> URL Shortener</h1>
        <p style={styles.subtitle}>
          Paste your long URL and get a fast, secure, and trackable short link.
        </p>

        {/* Input Section */}
        <div style={styles.inputContainer}>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter a long URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button style={styles.button} onClick={handleShorten} disabled={loading}>
            {loading ? <div className="spinner"></div> : "Shorten URL"}
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {/* Success Box */}
        {shortUrl && (
          <div style={styles.successBox}>
            <p style={styles.successTitle}>Short URL Ready</p>

            <div
              style={styles.copyBox}
              onClick={() => copyToClipboard(shortUrl)}
              title={copied ? "Copied!" : "Click to copy"}
            >
              {shortUrl}
            </div>

            {copied && <p style={styles.copiedText}>Copied!</p>}
          </div>
        )}
      </div>

      {/* History Section */}
      <div style={styles.historyCard}>
        <h2 style={styles.historyTitle}>Your Link History</h2>

        {/* ⭐ DELETE BUTTON */}
        <button style={styles.deleteButton} onClick={handleDeleteAll}>
          Delete All History
        </button>

        {history.length === 0 ? (
          <p style={styles.noHistory}>No links shortened yet.</p>
        ) : (
          <div style={styles.historyList}>
            {history.map((item, idx) => (
              <div key={idx} style={styles.historyItem}>
                <span style={styles.longURL}>{item.long}</span>

                <a
                  href={item.short}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.shortURL}
                  onClick={(e) => {
                    e.preventDefault();
                    copyToClipboard(item.short);
                  }}
                >
                  {item.short}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: "800px",
    width: "92%",
    margin: "0 auto",
    paddingTop: "40px",
    paddingBottom: "50px",
  },

  card: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "14px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
    marginBottom: "25px",
  },

  title: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "5px",
    color: "#111",
    textAlign: "center",
  },

  subtitle: {
    fontSize: "15px",
    textAlign: "center",
    color: "#666",
    marginBottom: "20px",
  },

  inputContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
  },

  input: {
    flex: 1,
    padding: "12px 14px",
    border: "1px solid #d0d0d0",
    borderRadius: "8px",
    fontSize: "16px",
  },

  button: {
    padding: "12px 20px",
    background: "#0066ff",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    minWidth: "135px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  error: {
    color: "red",
    marginTop: "10px",
    textAlign: "center",
  },

  successBox: {
    marginTop: "25px",
    padding: "15px",
    background: "#e8ffe7",
    borderRadius: "10px",
    border: "1px solid #b6e9b4",
    textAlign: "center",
  },

  successTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "8px",
  },

  copyBox: {
    padding: "10px",
    background: "white",
    borderRadius: "6px",
    border: "1px solid #4caf50",
    cursor: "pointer",
    fontWeight: "bold",
    wordWrap: "break-word",
  },

  copiedText: {
    marginTop: "6px",
    color: "#2e7d32",
    fontSize: "14px",
  },

  historyCard: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
  },

  historyTitle: {
    fontSize: "20px",
    marginBottom: "15px",
  },

  deleteButton: {
    padding: "10px",
    background: "#ff3b3b",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "15px",
    width: "100%",
  },

  noHistory: {
    color: "#888",
    fontSize: "15px",
  },

  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  historyItem: {
    padding: "10px 12px",
    background: "#f8f8f8",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
  },

  longURL: {
    color: "#444",
    marginBottom: "4px",
    fontSize: "14px",
  },

  shortURL: {
    color: "#0066ff",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  },
};
