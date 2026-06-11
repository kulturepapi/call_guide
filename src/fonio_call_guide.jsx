import React, { useState, useEffect, useRef } from 'react';

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #000000;
    --surface-1: #1C1C1E;
    --surface-2: #2C2C2E;
    --surface-3: #3A3A3C;
    --border: rgba(255,255,255,0.08);
    --border-strong: rgba(255,255,255,0.16);
    --text-primary: #FFFFFF;
    --text-secondary: rgba(255,255,255,0.55);
    --text-tertiary: rgba(255,255,255,0.30);
    --blue: #0A84FF;
    --green: #30D158;
    --amber: #FF9F0A;
    --red: #FF453A;
    --purple: #BF5AF2;
    --teal: #5AC8FA;
    --radius-card: 12px;
    --radius-tag: 6px;
    --radius-quote: 8px;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  html, body { 
    background: var(--bg); 
    color: var(--text-primary); 
    height: 100vh;
    overflow: hidden;
  }

  /* STICKY TOP BAR */
  .topbar {
    background: rgba(0,0,0,0.85);
    border-bottom: 0.5px solid var(--border);
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .topbar-dot {
    width: 8px; height: 8px;
    background: var(--green);
    border-radius: 50%;
    flex-shrink: 0;
    animation: pulse 2.4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .topbar-text {
    font-size: 12px;
    font-weight: 500;
    color: var(--green);
    letter-spacing: -0.01em;
  }

  /* TIMER SECTION */
  .timer-section {
    padding: 12px 16px;
    border-bottom: 0.5px solid var(--border);
    flex-shrink: 0;
  }

  .timer-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .timer-digits {
    font-size: 32px;
    font-weight: 700;
    letter-spacing: -1px;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    min-width: 95px;
  }

  .btn {
    padding: 6px 12px;
    font-size: 11px;
    font-weight: 600;
    border-radius: var(--radius-tag);
    cursor: pointer;
    border: none;
    letter-spacing: 0.02em;
  }

  .btn-start { background: rgba(48,209,88,0.15); color: var(--green); border: 0.5px solid rgba(48,209,88,0.3); }
  .btn-pause { background: rgba(255,69,58,0.15); color: var(--red); border: 0.5px solid rgba(255,69,58,0.3); }
  .btn-reset { background: transparent; color: var(--text-secondary); border: 0.5px solid var(--border-strong); }

  .timer-elapsed {
    margin-left: auto;
    font-size: 11px;
    color: var(--text-tertiary);
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  .progress-bg {
    height: 4px;
    background: var(--surface-2);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 1s linear, background 0.3s;
  }

  /* TABS SECTION */
  .tabs-section {
    display: flex;
    gap: 6px;
    padding: 10px 16px;
    border-bottom: 0.5px solid var(--border);
    overflow-x: auto;
    scrollbar-width: none;
    flex-shrink: 0;
  }
  .tabs-section::-webkit-scrollbar { display: none; }

  .tab {
    flex-shrink: 0;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    background: transparent;
    color: var(--text-secondary);
    border: 0.5px solid var(--border);
  }

  .tab.active {
    background: var(--surface-2);
    color: var(--text-primary);
    border-color: var(--border-strong);
    font-weight: 600;
  }

  .tab.suggested {
    border-style: dashed;
    border-color: var(--text-tertiary);
  }

  /* MAIN CONTENT AREA */
  .main-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    scrollbar-width: thin;
    scrollbar-color: var(--surface-2) transparent;
  }

  /* SECTION LABEL */
  .section-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.07em;
    padding: 14px 0 6px;
  }

  /* QUOTE BLOCK */
  .quote-block {
    background: var(--surface-2);
    border-radius: var(--radius-quote);
    border-left: 2px solid var(--surface-3);
    padding: 12px 14px;
    margin: 6px 0;
  }

  .quote-block.accent-blue   { border-left-color: var(--blue); }
  .quote-block.accent-green  { border-left-color: var(--green); }
  .quote-block.accent-amber  { border-left-color: var(--amber); }
  .quote-block.accent-red    { border-left-color: var(--red);   }
  .quote-block.accent-teal   { border-left-color: var(--teal);  }
  .quote-block.accent-purple { border-left-color: var(--purple);}

  .quote-text {
    font-size: 14px;
    color: var(--text-primary);
    line-height: 1.55;
    letter-spacing: -0.005em;
  }

  .quote-cue {
    font-size: 12px;
    color: var(--text-secondary);
    font-style: italic;
    margin-top: 6px;
    line-height: 1.45;
  }

  /* PILL COMPONENTS */
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 700;
    padding: 5px 10px;
    border-radius: 20px;
    margin: 8px 0 4px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .pill-red    { background: rgba(255,69,58,0.15);   color: #FF453A; border: 0.5px solid rgba(255,69,58,0.3); }

  .pill-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .pill-red .pill-dot { background: #FF453A; }

  /* GATE BOX */
  .gate-box {
    background: rgba(255,159,10,0.08);
    border: 0.5px solid rgba(255,159,10,0.25);
    border-radius: var(--radius-card);
    padding: 12px 14px;
    margin: 16px 0 8px;
  }

  .gate-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--amber);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 7px;
    letter-spacing: 0.01em;
  }

  .gate-item {
    font-size: 13px;
    color: rgba(255,159,10,0.85);
    padding: 3px 0;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    line-height: 1.45;
  }

  .gate-item::before {
    content: '';
    width: 14px; height: 14px;
    border: 1.5px solid rgba(255,159,10,0.4);
    border-radius: 4px;
    flex-shrink: 0;
    margin-top: 1px;
  }

  /* TWO OPTIONS */
  .options-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin: 10px 0;
  }

  .option-card {
    background: var(--surface-1);
    border: 0.5px solid var(--border);
    border-radius: var(--radius-card);
    padding: 12px;
  }

  .option-number {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 5px;
  }

  .option-title { font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; }
  .option-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.5; }

  /* FOOTER NAV */
  .bottom-nav {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    border-top: 0.5px solid var(--border);
    background: var(--bg);
    flex-shrink: 0;
    align-items: center;
  }

  .nav-btn {
    flex: 1;
    padding: 10px 0;
    font-size: 13px;
    font-weight: 600;
    border-radius: var(--radius-card);
    cursor: pointer;
    background: var(--surface-1);
    color: var(--text-primary);
    border: 0.5px solid var(--border);
  }
  .nav-btn:disabled { opacity: 0.3; cursor: default; }
  
  .nav-status {
    font-size: 11px;
    color: var(--text-tertiary);
    font-variant-numeric: tabular-nums;
  }

  /* MECCA BAR */
  .mecca-bar {
    background: rgba(48,209,88,0.06);
    border: 0.5px solid rgba(48,209,88,0.2);
    border-radius: var(--radius-card);
    padding: 12px 16px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .mecca-bar-icon {
    font-size: 16px;
    flex-shrink: 0;
  }

  .mecca-bar-q {
    font-size: 13px;
    font-weight: 600;
    color: var(--green);
    letter-spacing: -0.008em;
    line-height: 1.4;
  }

  .mecca-bar-sub {
    font-size: 11px;
    color: rgba(48,209,88,0.6);
    margin-top: 2px;
    letter-spacing: 0.005em;
  }

  /* FOOTER NOTE */
  .footer-note {
    background: rgba(191,90,242,0.08);
    border: 0.5px solid rgba(191,90,242,0.2);
    border-radius: var(--radius-card);
    padding: 12px 16px;
    margin-top: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .footer-note-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--purple);
    flex-shrink: 0;
  }

  .footer-note-text {
    font-size: 12px;
    color: rgba(191,90,242,0.85);
    line-height: 1.5;
    letter-spacing: -0.003em;
  }
`;

const PHASES = [
  {
    id: 0, start: 0, title: "Rapport",
    lines: [
      { type: "quote", text: "„Sasa, hey — Dersim hier von fonio. Was war das Highlight deiner Woche?\"", cue: "Letzte 2–3 Wörter spiegeln. Schweigen. Echten Kontakt herstellen. Dann hart wechseln." }
    ]
  },
  {
    id: 1, start: 3, title: "Opener",
    lines: [
      { type: "quote", accent: "accent-blue", text: "„Sasa, du hast nicht zum Spaß angerufen. Was passiert gerade bei euch, dass du dir gedacht hast — okay, ich schau mir das jetzt an?\"", cue: "Mund zu. Erstes Pain-Signal ist Gold." },
      { type: "quote", text: "„Was wäre das ideale Ergebnis aus unserem Gespräch heute?\"", cue: "Er antwortet. Dann direkt in den Pain Funnel." }
    ]
  },
  {
    id: 2, start: 5, title: "Pain Funnel",
    lines: [
      { type: "label", text: "L1 — Symptom" },
      { type: "quote", accent: "accent-red", text: "„Wie sieht euer Anrufalltag konkret aus? Wie viele kommen rein — und was wollen die Leute?\"", cue: "Er antwortet. Mund zu. Erstes Pain-Signal aufnehmen." },
      { type: "quote", text: "„Wann war der Moment wo du gemerkt hast — das kann so nicht weitergehen?\"", cue: "Go-back-in-time. Nur nach erstem echten Pain-Signal stellen." },
      { type: "pill", accent: "pill-red", text: "ORLOB PFLICHTFRAGE — niemals überspringen" },
      { type: "quote", accent: "accent-red", text: "„Warum glaubst du passiert das eigentlich?\"", cue: "Mund zu. Seine Antwort ist die Root Cause." },
      { type: "quote", text: "„Was habt ihr bisher versucht das zu ändern?\"", cue: "Mund zu." },
      { type: "label", text: "L2 — Root Cause bestätigen" },
      { type: "quote", accent: "accent-teal", text: "„Also der eigentliche Grund ist [seine Root Cause in seinen Worten]. Stimmt das?\"", cue: "Erst nach
