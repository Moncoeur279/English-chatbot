import { useState } from "react";
import "../styles/DictionaryModal.css";

export function DictionaryModal({ onClose, onWordLookup }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Mock dictionary data
  const mockDictionary = {
    hello: {
      word: "hello",
      pronunciation: "/həˈloʊ/",
      partOfSpeech: "interjection",
      definition: "Used as a greeting or to begin a phone conversation.",
      example: "Hello, how are you today?"
    },
    artificial: {
      word: "artificial",
      pronunciation: "/ˌɑːrtɪˈfɪʃəl/",
      partOfSpeech: "adjective",
      definition: "Made or produced by human beings rather than occurring naturally.",
      example: "The flowers were artificial, not real."
    },
    intelligence: {
      word: "intelligence",
      pronunciation: "/ɪnˈtelɪdʒəns/",
      partOfSpeech: "noun",
      definition: "The ability to acquire and apply knowledge and skills.",
      example: "She showed great intelligence in solving the problem."
    },
    chatbot: {
      word: "chatbot",
      pronunciation: "/ˈtʃætbɒt/",
      partOfSpeech: "noun",
      definition: "A computer program designed to simulate conversation with human users.",
      example: "The company uses a chatbot to answer customer questions."
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);

    // Simulate API call delay
    setTimeout(() => {
      const result = mockDictionary[searchTerm.toLowerCase()];
      if (result) {
        setSearchResult(result);
      } else {
        setSearchResult({
          word: searchTerm,
          pronunciation: "Not found",
          partOfSpeech: "",
          definition: `Sorry, we couldn't find a definition for "${searchTerm}". Try checking the spelling or searching for a different word.`,
        });
      }
      setIsSearching(false);
      if (onWordLookup) {
        onWordLookup(searchTerm);
      }
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="dictionary-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📚 Dictionary Lookup</h3>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="dictionary-content">
          <div className="search-section">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Enter a word to look up..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="search-input"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchTerm.trim()}
                className="search-button"
              >
                🔍
              </button>
            </div>
          </div>

          <div className="results-section">
            {isSearching ? (
              <div className="loading-state">
                <div className="loading-dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
                <span>Searching...</span>
              </div>
            ) : searchResult ? (
              <div className="definition-card">
                <div className="word-header">
                  <h4 className="word-title">{searchResult.word}</h4>
                  {searchResult.pronunciation !== "Not found" && (
                    <span className="pronunciation">{searchResult.pronunciation}</span>
                  )}
                  {searchResult.partOfSpeech && (
                    <span className="part-of-speech">{searchResult.partOfSpeech}</span>
                  )}
                </div>

                <div className="definition-section">
                  <h5>Definition:</h5>
                  <p>{searchResult.definition}</p>
                </div>

                {searchResult.example && (
                  <div className="example-section">
                    <h5>Example:</h5>
                    <p className="example">"{searchResult.example}"</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📖</div>
                <p>Enter a word to search for its definition</p>
                <p className="suggestion">Try words like: hello, artificial, intelligence, chatbot</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}