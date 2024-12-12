import React, { useState } from 'react';
import './App.css';

function App() {
  const [songId, setSongId] = useState('');
  const [newSong, setNewSong] = useState({ track: '', artist: '' });
  const [updatedSong, setUpdatedSong] = useState({ id: '', track: '', artist: '' });
  const [apiResponse, setApiResponse] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

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
      // First, verify the input song exists
      const songCheckResponse = await fetch(`http://localhost:8000/songs/${songId}`);
      const songCheckData = await songCheckResponse.json();

      if (!songCheckData.id) {
        alert('Invalid Song ID');
        return;
      }

      // Get recommendations
      const recommendationResponse = await fetch(`http://localhost:8000/recommendations/${songId}`);
      const recommendationData = await recommendationResponse.json()

      // Find recommended songs by track name
      if (recommendationData.recommended_tracks) {
        const recommendedSongDetails = await Promise.all(
          recommendationData.recommended_tracks.map(async (trackName) => {
            // Find song by track name
            const songsResponse = await fetch('http//localhost:8000/songs');
            const allSongs = await songsResponse.json();
            return allSongs.find(song => song.track === trackName);
          })
        );

        // Filter out any undefined results
        const validRecommendations = recommendedSongDetails.filter(song => song);
        setRecommendations(validRecommendations);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations(null);
      alert('Failed to fetch recommendations');
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
                  <p>Track: {song.track}</p>
                  <p>Artist: {song.artist}</p>
                  <p>Album: {song.album}</p>
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