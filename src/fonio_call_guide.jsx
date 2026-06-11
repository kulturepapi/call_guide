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
