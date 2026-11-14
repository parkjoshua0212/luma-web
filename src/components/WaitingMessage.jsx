import React, { useEffect, useState } from 'react';

const SLOW_AFTER_MS = 3000;
const SLOW_MESSAGE = 'Waking up the server (free hosting) — this can take up to a minute.';

// Shown while waiting on the API. The backend runs on Render's free tier and
// can take 30–60s to wake, so after a few seconds the label is swapped for an
// explanation. Mount it only while waiting: the timer starts on mount.
// With no label, nothing shows until the slow message (for forms whose button
// already says what's happening).
export default function WaitingMessage({ label = null }) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), SLOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, []);

  const text = slow ? SLOW_MESSAGE : label;
  if (!text) return null;

  return <p role="status">{text}</p>;
}
