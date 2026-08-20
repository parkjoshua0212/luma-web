import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import client from '../api/client';
import TopNav from '../components/TopNav';

export default function Chat() {
  const { id } = useParams();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [openCorrectionId, setOpenCorrectionId] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    client
      .get(`/api/conversations/${id}`)
      .then((res) => {
        setConversation(res.data.conversation);
        setMessages(res.data.messages);
      })
      .catch(() => setError('Could not load this conversation.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const content = draft.trim();
    if (!content || sending) return;

    setSending(true);
    setError('');
    setDraft('');

    try {
      const res = await client.post(`/api/conversations/${id}/message`, { content });
      setMessages((prev) => [...prev, res.data.userMessage, res.data.reply]);
    } catch (err) {
      const data = err.response?.data;
      if (data?.userMessage) {
        setMessages((prev) => [...prev, data.userMessage]);
        setError(
          err.response.status === 429
            ? "You've hit today's free AI usage limit. Try again tomorrow."
            : 'Your message sent, but the AI reply failed. Try sending again.'
        );
      } else {
        setError('Something went wrong sending that message.');
        setDraft(content);
      }
    } finally {
      setSending(false);
    }
  };

  const toggleCorrection = (messageId) => {
    setOpenCorrectionId((prev) => (prev === messageId ? null : messageId));
  };

  if (loading) {
    return (
      <div>
        <TopNav />
        <div className="page">Loading…</div>
      </div>
    );
  }

  return (
    <div>
      <TopNav />
      <div className="page">
        {conversation && (
          <div style={{ marginBottom: '1.2rem' }}>
            <span className={`mode-pill ${conversation.mode}`}>{conversation.mode}</span>
          </div>
        )}

        <div className="chat-window">
          {messages.map((m) => {
            const hasCorrection = m.sender === 'user' && m.corrected_content;
            const isOpen = openCorrectionId === m.id;

            return (
              <div key={m.id} className="bubble-row">
                <div className={`bubble ${m.sender === 'user' ? 'user' : 'ai'}`}>
                  {m.content}
                  {hasCorrection && (
                    <button
                      className="lightbulb-btn"
                      onClick={() => toggleCorrection(m.id)}
                      aria-label="Show grammar suggestion"
                      title="Grammar suggestion available"
                    >
                      💡
                    </button>
                  )}
                </div>

                {hasCorrection && isOpen && (
                  <div className="correction-panel">
                    <div className="label">Suggested</div>
                    <p className="corrected">{m.corrected_content}</p>
                    <p className="explanation">{m.correction_explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={sendMessage} className="chat-input-row">
          <textarea
            rows={2}
            placeholder="Type a message…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
          />
          <button type="submit" className="btn-primary" disabled={sending || !draft.trim()}>
            {sending ? 'Sending…' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}