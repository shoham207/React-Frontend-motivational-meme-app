import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [meme, setMeme] = useState(null);
  const [memeId, setMemeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMeme = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5173/api/meme');
      if (!response.ok) {
        throw new Error('Failed to fetch meme');
      }
      const data = await response.json();
      setMeme(data);
      setMemeId(data.meme_id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadMeme = async () => {
    if (!memeId) return;

    try {
      const response = await fetch(`http://localhost:5173/memes/${memeId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `motivational-meme-${memeId}.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        setError('Download failed');
      }
    } catch (err) {
      setError('Download failed');
    }
  };

  useEffect(() => {
    fetchMeme();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <h1>Motivational Meme Generator</h1>

        {loading && <p>Generating your motivational meme...</p>}

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
            <button onClick={fetchMeme}>Try Again</button>
          </div>
        )}

        {meme && !loading && (
          <div className="meme-container">
            <img
              src={`http://localhost:5173/memes/${memeId}`}
              alt="Motivational Meme"
              className="meme-image"
            />
            <div className="button-group">
              <button onClick={fetchMeme} className="generate-btn">
                Generate New Meme
              </button>
              <button onClick={downloadMeme} className="download-btn">
                Download Meme
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;