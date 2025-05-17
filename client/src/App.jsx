import React, { useState } from 'react';
import io from 'socket.io-client';
import Chats from './Chats';
import './index.css';

const socket = io.connect('http://localhost:3000');

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);

  function joinRoom() {
    if (username !== '' && room !== '') {
      socket.emit('join-room', room);
      setShowChat(true);
    }
  }

  return (
    <div className="app-wrapper">
      <div className="app-box">
        {!showChat ? (
          <div className="join-chat-container">
            <h2>Join Chat</h2>
            <input
              type="text"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter room ID"
              onChange={(e) => setRoom(e.target.value)}
            />
            <button onClick={joinRoom}>Join Room</button>
          </div>
        ) : (
          <Chats socket={socket} username={username} room={room} />
        )}
      </div>
    </div>
  );
}

export default App;
