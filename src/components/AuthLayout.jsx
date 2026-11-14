import React from 'react';
import { Brand } from './TopNav';

// Two-column auth screen: the left side explains Luma with a static sample
// exchange (so a first-time visitor sees what the app does before logging in);
// the right side holds the form.
export default function AuthLayout({ children }) {
  return (
    <div className="auth">
      <section className="auth-story">
        <Brand to="/login" />
        <div className="story-body">
          <h1>Practice a language by having real conversations.</h1>
          <p className="lede">
            Chat with an AI partner in a formal or casual tone. When you make a mistake,
            Luma marks the fix and explains it without interrupting the conversation.
          </p>

          <div className="sample-chat" aria-label="Example conversation">
            <div className="bubble ai">Good evening! What did you do this weekend?</div>
            <div className="bubble user" style={{ alignSelf: 'flex-end' }}>
              I go to the market and buyed some apples.
            </div>
            <div className="sample-note">
              <div className="sample-label">
                <span className="swatch" aria-hidden="true" />
                Correction
              </div>
              <p className="marked">
                I <span>went</span> to the market and <span>bought</span> some apples.
              </p>
              <p className="explanation">Finished actions take the past tense: go → went, buy → bought.</p>
            </div>
          </div>
        </div>
        <p className="story-foot">
          React + Vite frontend on a REST API with JWT auth and Gemini-powered replies.
        </p>
      </section>

      <main className="auth-form-wrap">
        <div className="auth-form">{children}</div>
      </main>
    </div>
  );
}
