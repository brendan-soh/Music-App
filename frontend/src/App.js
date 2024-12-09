import React, { useState } from 'react';
import './App.css';

function App() {
  const [songId, setSongId] = useState('');
  const [newSong, setNewSong] = useState({ track: '', artist: '' });
  const [updatedSong, setUpdatedSong] = useState({ id: '', track: '', artist: '' });
  const [apiResponse, setApiResponse] = useState(null);

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
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </div>
      </header>
    </div>
  );
}

export default App;