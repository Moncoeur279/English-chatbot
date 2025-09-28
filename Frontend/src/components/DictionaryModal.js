import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DictionaryModal.css";

export function DictionaryPage() {
  const navigate = useNavigate();
  const [word, setWord] = useState("");
  const [result, setResult] = useState(null);

  const handleLookup = () => {
    if (!word.trim()) return;
    setResult({
      word,
      phonetic: "/demo/",
      pos: "noun",
      definition: `This is a sample definition of "${word}".`,
      example: `Here is an example sentence with the word "${word}".`,
    });
  };

  return (
    <div className="dictionary-modal-overlay" onClick={() => navigate(-1)}>
      <div className="dictionary-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📚 Dictionary Lookup</h3>
          <button className="close-button" onClick={() => navigate(-1)}>✕</button>
        </div>

        <div className="modal-body">
          <div className="search-row">
            <input
              className="search-input"
              type="text"
              placeholder="Look up a word..."
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleLookup(); }}
            />
            <button className="search-btn" onClick={handleLookup}>🔍</button>
          </div>

          {result && (
            <div className="dictionary-result">
              <div className="result-header">
                <div className="word">{result.word}</div>
                <div className="phonetic">{result.phonetic}</div>
                <div className="pos">{result.pos}</div>
              </div>
              <div className="section">
                <h5>Definition:</h5>
                <div className="definition">{result.definition}</div>
              </div>
              <div className="section">
                <h5>Example:</h5>
                <div className="example">{result.example}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
