import React, { useState } from 'react';
import client from '../api/client';
import TopNav from '../components/TopNav';

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
    <div>
      <TopNav />
      <div className="page">
        <h1>Grammar check</h1>
        <p>Paste a sentence and get a correction with a plain-language explanation.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <textarea
              rows={3}
              placeholder="e.g. She dont like the movie."
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={checking || !sentence.trim()}>
            {checking ? 'Checking…' : 'Check sentence'}
          </button>
        </form>

        {error && <div className="error-banner">{error}</div>}

        {result && (
          <div className="correction-result card">
            <div className="label">Original</div>
            <p className="original">{result.original}</p>
            <div className="label">Corrected</div>
            <p className="corrected">{result.corrected}</p>
            <div className="label">Why</div>
            <p style={{ color: 'var(--paper)' }}>{result.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}