import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/songs')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data);
        setSongs(data);
      })
      .catch(error => console.error('Error fetching songs:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify YouTube API</h1>
        <p>Songs from our database:</p>
        <ul>
          {songs.map(song => (
            <li key={song.id}>{song.track} by {song.artist}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
