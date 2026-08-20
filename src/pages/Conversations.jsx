import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import TopNav from '../components/TopNav';

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
    <div>
      <TopNav />
      <div className="page">
        <h1>Your conversations</h1>
        <p>Pick a tone and start talking, or jump back into an existing session.</p>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
          <button className="btn-primary" disabled={starting} onClick={() => startConversation('formal')}>
            Start formal
          </button>
          <button className="btn-ghost" disabled={starting} onClick={() => startConversation('casual')}>
            Start casual
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <p>Loading…</p>
        ) : conversations.length === 0 ? (
          <div className="card">
            <p style={{ margin: 0 }}>No conversations yet. Start one above.</p>
          </div>
        ) : (
          <div className="conv-list">
            {conversations.map((conv) => (
              <Link key={conv.id} to={`/chat/${conv.id}`} className="conv-item">
                <div>
                  <span className={`mode-pill ${conv.mode}`}>{conv.mode}</span>
                  <div className="meta">Started {new Date(conv.started_at).toLocaleDateString()}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
