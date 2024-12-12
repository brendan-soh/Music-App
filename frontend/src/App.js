import React, { useState } from 'react';
import './App.css';

function App() {
  const [songId, setSongId] = useState('');
  const [newSong, setNewSong] = useState({ track: '', artist: '' });
  const [updatedSong, setUpdatedSong] = useState({ id: '', track: '', artist: '' });
  const [apiResponse, setApiResponse] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);

  const getSongs = async () => {
    const response = await fetch('http://localhost:8000/songs');
    const data = await response.json();
    setApiResponse(data);
  };

  const getSong = async () => {
    const response = await fetch(`http://localhost:8000/songs/${songId}`);
    const data = await response.json();
    setApiResponse(data);
  };

  const getRecommendations = async () => {
    try {
      // Reset previous error and recommendations
      setError(null);
      setRecommendations(null);

      // First, verify the input song exists
      const songCheckResponse = await fetch(`http://localhost:8000/songs/${songId}`);
      const songCheckData = await songCheckResponse.json();

      if (!songCheckData.id) {
        alert('Invalid Song ID');
        return;
      }

      // Get recommendations
      const recommendationResponse = await fetch(`http://localhost:8000/recommendations/${songId}?num_recommendations=5`);

      if (!recommendationResponse.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const recommendationData = await recommendationResponse.json();

      // Check if the response has the expected structure
      const recommendations = recommendationData.recommended_tracks || recommendationData;

      // Set the recommendations
      setRecommendations(recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError(error.message || 'Failed to fetch recommendations');
    }
  };

  const createSong = async () => {
    const response = await fetch('http://localhost:8000/songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSong),
    });
    const data = await response.json();
    setApiResponse(data);
  };

  const updateSong = async () => {
    const response = await fetch(`http://localhost:8000/songs/${updatedSong.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSong),
    });
    const data = await response.json();
    setApiResponse(data);
  };

  const deleteSong = async () => {
    const response = await fetch(`http://localhost:8000/songs/${songId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    setApiResponse(data);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Music App</h1>
        <div>
          <h2>API Testing</h2>
          <div>
            <button onClick={getSongs}>Get All Songs</button>
          </div>
          <div>
            <label>
              Song ID:
              <input
                type="text"
                value={songId}
                onChange={(e) => setSongId(e.target.value)}
              />  
            </label>
            <button onClick={getSong}>Get Song</button>
            <button onClick={getRecommendations}>Get Recommendations</button>
          </div>
          <div>
            <label>
              Track:
              <input
                type="text"
                value={newSong.track}
                onChange={(e) => setNewSong({ ...newSong, track: e.target.value })}
              />
            </label>
            <label>
              Artist:
              <input
                type="text"
                value={newSong.artist}
                onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
              />
            </label>
            <button onClick={createSong}>Create Song</button>
          </div>
          <div>
            <label>
              ID:
              <input
                type="text"
                value={updatedSong.id}
                onChange={(e) => setUpdatedSong({ ...updatedSong, id: e.target.value })}
              />
            </label>
            <label>
              Track:
              <input
                type="text"
                value={updatedSong.track}
                onChange={(e) => setUpdatedSong({ ...updatedSong, track: e.target.value })}
              />
            </label>
            <label>
              Artist:
              <input
                type="text"
                value={updatedSong.artist}
                onChange={(e) => setUpdatedSong({ ...updatedSong, artist: e.target.value })}
              />
            </label>
            <button onClick={updateSong}>Update Song</button>
          </div>
          <div>
            <button onClick={deleteSong}>Delete Song</button>
          </div>

          {/* Main API Response */}
          <div>
            <h3>API Response</h3>
            <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
          </div>

          {/* Error Handling*/}
          {error && (
            <div style={{
              color: 'red',
              backgroundColor: 'rgba(255,0,0,0.1)',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '5px'
            }}>
              {error}
            </div>
          )}

          {/* Recommendations Section */}
          {recommendations && recommendations.length > 0 && (
            <div>
              <h3>Recommended Songs</h3>
              {recommendations.map((song, index) => (
                <div key={index} style={{
                  border: '1px solid white',
                  margin: '10px',
                  padding: '10px',
                  borderRadius: '5px'
                }}>
                  <p>Track: {song.track || song.Track}</p>
                  <p>Artist: {song.artist || song.Artist}</p>
                  <p>Album: {song.album || song.Album}</p>
                  <details>
                    <summary>More Details</summary>
                    <pre>{JSON.stringify(song, null, 2)}</pre>
                  </details>
                </div>
              ))}
            </div>
          )}

          {recommendations && recommendations.length === 0 && (
            <div>
              <p>No recommendations found.</p>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;