import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import client from '../api/client';
import TopNav from '../components/TopNav';
import WaitingMessage from '../components/WaitingMessage';

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
      <div className="app-shell">
        <TopNav />
        <div className="center-status">
          <WaitingMessage label="Loading…" />
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <TopNav />
      <main className="chat-page">
        <div className="chat-head">
          <Link to="/" className="back-link">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All conversations
          </Link>
          {conversation && (
            <span className={`mode-pill ${conversation.mode}`}>{conversation.mode}</span>
          )}
        </div>

        <div className="chat-window" aria-live="polite">
          {messages.length === 0 && !error && (
            <p className="chat-empty">Say hello to start. Your partner will reply in a {conversation?.mode || 'matching'} tone.</p>
          )}

          {messages.map((m) => {
            const isUser = m.sender === 'user';
            const hasCorrection = isUser && m.corrected_content;
            const isOpen = openCorrectionId === m.id;

            return (
              <div key={m.id} className={`bubble-row ${isUser ? 'user' : 'ai'}`}>
                <div className={`bubble ${isUser ? 'user' : 'ai'}`}>{m.content}</div>

                {hasCorrection && (
                  <button
                    className="lightbulb-btn"
                    onClick={() => toggleCorrection(m.id)}
                    aria-label="Show grammar suggestion"
                    aria-expanded={isOpen}
                    title="Grammar suggestion available"
                  >
                    <span className="swatch" aria-hidden="true" />
                    {isOpen ? 'Hide suggestion' : 'Suggestion'}
                  </button>
                )}

                {hasCorrection && isOpen && (
                  <div className="correction-panel">
                    <p className="marked"><span>{m.corrected_content}</span></p>
                    <p className="explanation">{m.correction_explanation}</p>
                  </div>
                )}
              </div>
            );
          })}

          {sending && (
            <div className="bubble-row ai">
              <WaitingMessage label="Thinking…" />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="composer">
          {error && <div className="error-banner" role="alert">{error}</div>}

          <form onSubmit={sendMessage} className="chat-input-row">
            <textarea
              rows={1}
              aria-label="Message"
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
          <p className="composer-hint">Enter to send, Shift + Enter for a new line</p>
        </div>
      </main>
    </div>
  );
}
