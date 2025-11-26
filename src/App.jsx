import React, { useEffect, useRef, useState } from 'react';
import ChatBubble from './components/ChatBubble.jsx';
import { ENDPOINT, sendChatMessage } from './api/chat.js';

const makeId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export default function App() {
  const [userId, setUserId] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [status, setStatus] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!userId.trim()) return;
    setLoggedIn(true);
    setStatus('Connecting...');
    sendChatMessage({ userId, message: '' })
      .then((data) => {
        const replyText =
          data.reply || data.message || data.text || 'Welcome back!';
        setChat((prev) => [
          ...prev,
          {
            id: makeId(),
            from: 'Bot',
            text: replyText,
            direction: 'in',
            time: new Date(),
          },
        ]);
        setStatus('');
      })
      .catch((err) => {
        console.error(err);
        setStatus('Network error');
        setChat((prev) => [
          ...prev,
          {
            id: makeId(),
            from: 'System',
            text: 'Could not reach the chatbot endpoint on login.',
            direction: 'in',
            time: new Date(),
          },
        ]);
      });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!loggedIn || !message.trim()) return;

    const outgoing = {
      id: makeId(),
      from: 'You',
      text: message.trim(),
      direction: 'out',
      time: new Date(),
    };

    setChat((prev) => [...prev, outgoing]);
    setMessage('');

    try {
      setStatus('Sending...');
      const data = await sendChatMessage({ userId, message: outgoing.text });
      const replyText = data.reply || data.message || data.text || 'Received';

      const incoming = {
        id: makeId(),
        from: 'Bot',
        text: replyText,
        direction: 'in',
        time: new Date(),
      };
      setChat((prev) => [...prev, incoming]);
      setStatus('');
    } catch (err) {
      console.error(err);
      setStatus('Network error');
      setChat((prev) => [
        ...prev,
        {
          id: makeId(),
          from: 'System',
          text: 'Could not reach the chatbot endpoint.',
          direction: 'in',
          time: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="frame">
      <aside className="sidebar">
        <h1>Chatbot Studio</h1>

        <div className="card">
          <label className="label">Login with phone number</label>
          <form
            onSubmit={handleLogin}
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <input
              className="input"
              placeholder="e.g. +15551234567"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              type="tel"
              pattern="[+0-9\\s-]+"
              title="Use digits, spaces, + or -"
            />
            <button className="button" type="submit">
              {loggedIn ? 'Logged in' : 'Enter'}
            </button>
          </form>
          <p className="small" style={{ marginTop: '8px' }}>
            We only store the phone number locally to send it along with each
            message body.
          </p>
        </div>

        <div className="badge">
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--accent)',
            }}
          />
          {loggedIn ? 'Ready to chat' : 'Awaiting login'}
        </div>

        <p className="small">
          Tip: keep the tab open while testing; the state is in-memory only.
        </p>

        <p className="small">
          Endpoint is fixed to <code>{ENDPOINT}</code>. Requests send
          {' { userId, message }'} and display the reply field from the
          response.
        </p>
      </aside>

      <section className="main">
        <div className="topbar">
          <div className="title">Assistant</div>
          <div className="status">
            <span className="dot" />
            {loggedIn ? 'Online' : 'Login to start'}
            {status ? ` · ${status}` : ''}
          </div>
        </div>

        <div className="chat">
          {chat.map((m) => (
            <ChatBubble
              key={m.id}
              text={m.text}
              from={m.from}
              direction={m.direction}
              time={m.time}
            />
          ))}
          <div ref={bottomRef} />
        </div>

        <form className="composer" onSubmit={sendMessage}>
          <input
            placeholder={
              loggedIn ? 'Type a message...' : 'Login with phone number to start'
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!loggedIn}
          />
          <button
            className="send"
            type="submit"
            disabled={!loggedIn || !message.trim()}
          >
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
