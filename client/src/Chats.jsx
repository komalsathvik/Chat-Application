import React, { useState, useEffect, useRef } from 'react';

function Chats({ socket, username, room }) {
  const [currMessage, setCurrMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  
  // Ref to scroll to bottom
  const messagesEndRef = useRef(null);

  // Send message function
async function sendMessage() {
  if (currMessage !== '') {
    const msgData = {
      room: room,
      author: username,
      message: currMessage,
      time:
        new Date(Date.now()).getHours() +
        ':' +
        String(new Date(Date.now()).getMinutes()).padStart(2, '0'),
    };

    await socket.emit('send-msg', msgData);
    setMessageList((list) => [...list, msgData]); // Add message to your own chat view
    setCurrMessage(''); // Clear input
  }
}


  // Listen for incoming messages
  useEffect(() => {
    socket.off("receive").on("receive", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  // Scroll to bottom when messageList changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  return (
    <>
      <div className="chat-header">
        <p>CHAT APPLICATION</p>
      </div>
      <div className="chat-body">
        {messageList.map((messageContent, index) => (
          <div key={index} className={`message ${messageContent.author === username ? 'you' : 'other'}`}>
            <div className="message-info">
              <span className="author">{messageContent.author}</span>
              &nbsp;&nbsp;
              <span className="time">{messageContent.time}</span>
            </div>
            <div className="message-text">{messageContent.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-footer">
  <input
    type="text"
    placeholder="Type your message"
    value={currMessage}
    onChange={(e) => setCurrMessage(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    }}
  />
  <button onClick={sendMessage}>&#9658;</button>
</div>
    </>
  );
}

export default Chats;
