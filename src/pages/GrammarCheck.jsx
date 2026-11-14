import React, { useState } from 'react';
import client from '../api/client';
import TopNav from '../components/TopNav';
import WaitingMessage from '../components/WaitingMessage';

export default function GrammarCheck() {
  const [sentence, setSentence] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sentence.trim()) return;
    setChecking(true);
    setError('');
    setResult(null);
    try {
      const res = await client.post('/api/ai/correct', { sentence });
      setResult(res.data);
    } catch (err) {
      setError(
        err.response?.status === 429
          ? "You've hit today's free AI usage limit. Try again tomorrow."
          : 'Could not check that sentence. Try again.'
      );
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="app-shell">
      <TopNav />
      <main className="page">
        <div className="page-head">
          <h1>Grammar check</h1>
          <p className="lede">Paste a sentence and get a correction with a plain-language explanation.</p>
        </div>

        <form onSubmit={handleSubmit} className="panel check-form">
          <label htmlFor="sentence">Your sentence</label>
          <textarea
            id="sentence"
            rows={3}
            placeholder="e.g. She dont like the movie."
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
          />
          <div className="actions">
            <button type="submit" className="btn-primary" disabled={checking || !sentence.trim()}>
              {checking ? 'Checking…' : 'Check sentence'}
            </button>
          </div>
        </form>

        {checking && (
          <div style={{ marginTop: '1rem' }}>
            <WaitingMessage />
          </div>
        )}

        {error && <div className="error-banner" role="alert" style={{ marginTop: '1.5rem' }}>{error}</div>}

        {result && (
          <section className="correction-result panel" aria-live="polite">
            <div className="result-row">
              <span className="result-label">You wrote</span>
              <p className="struck">{result.original}</p>
            </div>
            <div className="result-row">
              <span className="result-label">Corrected</span>
              <p className="marked"><span>{result.corrected}</span></p>
            </div>
            <div className="result-row">
              <span className="result-label">Why</span>
              <p>{result.explanation}</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
