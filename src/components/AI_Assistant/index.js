import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./CSS/styles.css";

const QueryApp = () => {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const sendQuery = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setResponse("");
        try {
            const res = await fetch("https://rapid-grossly-raven.ngrok-free.app/gemini/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });
            const data = await res.json();
            setResponse(data.response);
        } catch (error) {
            setResponse("Error fetching response.");
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <h1>Ask Your Query</h1>
            <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type your question here..."
            ></textarea>
            <button onClick={sendQuery} disabled={loading}>
                {loading ? "Loading..." : "Submit"}
            </button>
            {response && <div className="response">{response}</div>}
        </div>
    );
};

ReactDOM.render(<QueryApp />, document.getElementById("root"));
