import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import TopNav from '../components/TopNav';
import WaitingMessage from '../components/WaitingMessage';

const MODES = [
  { mode: 'formal', sample: 'Good afternoon. How may I help you today?', cta: 'Start formal' },
  { mode: 'casual', sample: "Hey! What've you been up to?", cta: 'Start casual' },
];

export default function Conversations() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    client
      .get('/api/conversations')
      .then((res) => setConversations(res.data.conversations))
      .catch(() => setError('Could not load conversations.'))
      .finally(() => setLoading(false));
  }, []);

  const startConversation = async (mode) => {
    setStarting(true);
    try {
      const res = await client.post('/api/conversations/start', { mode });
      navigate(`/chat/${res.data.conversation.id}`);
    } catch {
      setError('Could not start a new conversation.');
      setStarting(false);
    }
  };

  return (
    <div className="app-shell">
      <TopNav />
      <main className="page">
        <div className="page-head">
          <h1>Your conversations</h1>
          <p className="lede">Pick a tone and start talking, or jump back into an existing session.</p>
        </div>

        <div className="start-grid">
          {MODES.map(({ mode, sample, cta }) => (
            <button
              key={mode}
              className={`start-option ${mode}`}
              disabled={starting}
              onClick={() => startConversation(mode)}
            >
              <span className={`mode-pill ${mode}`}>{mode}</span>
              <span className="sample">"{sample}"</span>
              <span className="cta">{cta}</span>
            </button>
          ))}
        </div>

        {error && <div className="error-banner" role="alert">{error}</div>}

        <h2 className="section-title">Recent</h2>
        {loading ? (
          <WaitingMessage label="Loading…" />
        ) : conversations.length === 0 ? (
          <div className="empty">
            <p>No conversations yet. Start one above.</p>
          </div>
        ) : (
          <ul className="conv-list">
            {conversations.map((conv) => (
              <li key={conv.id}>
                <Link to={`/chat/${conv.id}`} className="conv-item">
                  <span className={`mode-pill ${conv.mode}`}>{conv.mode}</span>
                  <span className="meta">
                    Started {new Date(conv.started_at).toLocaleDateString()}
                  </span>
                  <svg className="chev" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
