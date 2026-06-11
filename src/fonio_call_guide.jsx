// --- START ---
/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #000000; --surface-1: #1C1C1E; --surface-2: #2C2C2E; --surface-3: #3A3A3C;
    --border: rgba(255,255,255,0.08); --border-strong: rgba(255,255,255,0.16);
    --text-primary: #FFFFFF; --text-secondary: rgba(255,255,255,0.55); --text-tertiary: rgba(255,255,255,0.30);
    --blue: #0A84FF; --green: #30D158; --amber: #FF9F0A; --red: #FF453A; --purple: #BF5AF2; --teal: #5AC8FA;
    --radius-card: 12px; --radius-tag: 6px; --radius-quote: 8px;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  html, body { background: var(--bg); color: var(--text-primary); height: 100vh; overflow: hidden; }
  .app-container { display: flex; flex-direction: column; height: 100vh; width: 100%; overflow: hidden; }
  .topbar { background: rgba(0,0,0,0.85); border-bottom: 0.5px solid var(--border); padding: 10px 16px; display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .topbar-dot { width: 8px; height: 8px; background: var(--green); border-radius: 50%; flex-shrink: 0; animation: pulse 2.4s ease-in-out infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  .topbar-text { font-size: 12px; font-weight: 500; color: var(--green); letter-spacing: -0.01em; }
  .timer-section { padding: 12px 16px; border-bottom: 0.5px solid var(--border); flex-shrink: 0; }
  .timer-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
  .timer-digits { font-size: 32px; font-weight: 700; letter-spacing: -1px; font-variant-numeric: tabular-nums; line-height: 1; min-width: 95px; }
  .btn { padding: 6px 12px; font-size: 11px; font-weight: 600; border-radius: var(--radius-tag); cursor: pointer; border: none; letter-spacing: 0.02em; }
  .btn-start { background: rgba(48,209,88,0.15); color: var(--green); border: 0.5px solid rgba(48,209,88,0.3); }
  .btn-pause { background: rgba(255,69,58,0.15); color: var(--red); border: 0.5px solid rgba(255,69,58,0.3); }
  .btn-reset { background: transparent; color: var(--text-secondary); border: 0.5px solid var(--border-strong); }
  .timer-elapsed { margin-left: auto; font-size: 11px; color: var(--text-tertiary); text-align: right; font-variant-numeric: tabular-nums; }
  .progress-bg { height: 4px; background: var(--surface-2); border-radius: 2px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 2px; transition: width 1s linear, background 0.3s; }
  .tabs-section { display: flex; gap: 6px; padding: 10px 16px; border-bottom: 0.5px solid var(--border); overflow-x: auto; scrollbar-width: none; flex-shrink: 0; }
  .tabs-section::-webkit-scrollbar { display: none; }
  .tab { flex-shrink: 0; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; background: transparent; color: var(--text-secondary); border: 0.5px solid var(--border); }
  .tab.active { background: var(--surface-2); color: var(--text-primary); border-color: var(--border-strong); font-weight: 600; }
  .tab.suggested { border-style: dashed; border-color: var(--text-tertiary); }
  .main-content { flex: 1; overflow-y: auto; padding: 16px 16px 40px 16px; scrollbar-width: thin; scrollbar-color: var(--surface-2) transparent; }
  .section-label { font-size: 11px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.07em; padding: 14px 0 6px; }
  .quote-block { background: var(--surface-2); border-radius: var(--radius-quote); border-left: 2px solid var(--surface-3); padding: 12px 14px; margin: 6px 0; }
  .quote-block.accent-blue { border-left-color: var(--blue); } .quote-block.accent-green { border-left-color: var(--green); }
  .quote-block.accent-amber { border-left-color: var(--amber); } .quote-block.accent-red { border-left-color: var(--red); }
  .quote-block.accent-teal { border-left-color: var(--teal); } .quote-block.accent-purple { border-left-color: var(--purple); }
  .quote-text { font-size: 14px; color: var(--text-primary); line-height: 1.55; letter-spacing: -0.005em; }
  .quote-cue { font-size: 12px; color: var(--text-secondary); font-style: italic; margin-top: 6px; line-height: 1.45; }
  .pill { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; padding: 5px 10px; border-radius: 20px; margin: 8px 0 4px; letter-spacing: 0.02em; text-transform: uppercase; }
  .pill-red { background: rgba(255,69,58,0.15); color: #FF453A; border: 0.5px solid rgba(255,69,58,0.3); }
  .pill-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .pill-red .pill-dot { background: #FF453A; }
  .gate-box { background: rgba(255,159,10,0.08); border: 0.5px solid rgba(255,159,10,0.25); border-radius: var(--radius-card); padding: 12px 14px; margin: 16px 0 8px; }
  .gate-title { font-size: 12px; font-weight: 600; color: var(--amber); margin-bottom: 8px; display: flex; align-items: center; gap: 7px; letter-spacing: 0.01em; }
  .gate-item { font-size: 13px; color: rgba(255,159,10,0.85); padding: 3px 0; display: flex; align-items: flex-start; gap: 8px; line-height: 1.45; }
  .gate-item::before { content: ''; width: 14px; height: 14px; border: 1.5px solid rgba(255,159,10,0.4); border-radius: 4px; flex-shrink: 0; margin-top: 1px; }
  .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 10px 0; }
  .option-card { background: var(--surface-1); border: 0.5px solid var(--border); border-radius: var(--radius-card); padding: 12px; }
  .option-number { font-size: 11px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 5px; }
  .option-title { font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; }
  .option-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.5; }
  .bottom-nav { display: flex; gap: 8px; padding: 12px 16px; border-top: 0.5px solid var(--border); background: var(--bg); flex-shrink: 0; align-items: center; }
  .nav-btn { flex: 1; padding: 10px 0; font-size: 13px; font-weight: 600; border-radius: var(--radius-card); cursor: pointer; background: var(--surface-1); color: var(--text-primary); border: 0.5px solid var(--border); }
  .nav-btn:disabled { opacity: 0.3; cursor: default; }
  .nav-status { font-size: 11px; color: var(--text-tertiary); font-variant-numeric: tabular-nums; }
  .mecca-bar { background: rgba(48,209,88,0.06); border: 0.5px solid rgba(48,209,88,0.2); border-radius: var(--radius-card); padding: 12px 16px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
  .mecca-bar-icon { font-size: 16px; flex-shrink: 0; }
  .mecca-bar-q { font-size: 13px; font-weight: 600; color: var(--green); letter-spacing: -0.008em; line-height: 1.4; }
  .mecca-bar-sub { font-size: 11px; color: rgba(48,209,88,0.6); margin-top: 2px; letter-spacing: 0.005em; }
  .footer-note { background: rgba(191,90,242,0.08); border: 0.5px solid rgba(191,90,242,0.2); border-radius: var(--radius-card); padding: 12px 16px; margin-top: 16px; display: flex; align-items: center; gap: 10px; }
  .footer-note-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--purple); flex-shrink: 0; }
  .footer-note-text { font-size: 12px; color: rgba(191,90,242,0.85); line-height: 1.5; letter-spacing: -0.003em; }
`;

const TOTAL = 1800; // 30 mins

const PHASES = [
  {
    id: 0, start: 0, title: "Rapport",
    lines: [
      { type: "quote", text: "„Sasa, hey — Dersim hier von fonio. Was war das Highlight deiner Woche?“", cue: "Letzte 2–3 Wörter spiegeln. Schweigen. Echten Kontakt herstellen. Dann hart wechseln." }
    ]
  },
  {
    id: 1, start: 3, title: "Opener",
    lines: [
      { type: "quote", accent: "accent-blue", text: "„Sasa, du hast nicht zum Spaß angerufen. Was passiert gerade bei euch, dass du dir gedacht hast — okay, ich schau mir das jetzt an?“", cue: "Mund zu. Erstes Pain-Signal ist Gold." },
      { type: "quote", text: "„Was wäre das ideale Ergebnis aus unserem Gespräch heute?“", cue: "Er antwortet. Dann direkt in den Pain Funnel." }
    ]
  },
  {
    id: 2, start: 5, title: "Pain Funnel",
    lines: [
      { type: "label", text: "L1 — Symptom" },
      { type: "quote", accent: "accent-red", text: "„Wie sieht euer Anrufalltag konkret aus? Wie viele kommen rein — und was wollen die Leute?“", cue: "Er antwortet. Mund zu. Erstes Pain-Signal aufnehmen." },
      { type: "quote", text: "„Wann war der Moment wo du gemerkt hast — das kann so nicht weitergehen?“", cue: "Go-back-in-time. Nur nach erstem echten Pain-Signal stellen." },
      { type: "pill", accent: "pill-red", text: "ORLOB PFLICHTFRAGE — niemals überspringen" },
      { type: "quote", accent: "accent-red", text: "„Warum glaubst du passiert das eigentlich?“", cue: "Mund zu. Seine Antwort ist die Root Cause." },
      { type: "quote", text: "„Was habt ihr bisher versucht das zu ändern?“", cue: "Mund zu." },
      { type: "label", text: "L2 — Root Cause bestätigen" },
      { type: "quote", accent: "accent-teal", text: "„Also der eigentliche Grund ist [seine Root Cause in seinen Worten]. Stimmt das?“", cue: "Erst nach seiner Bestätigung weiter. Nicht überspringen." },
      { type: "label", text: "L2 — Ripple Effects" },
      { type: "quote", text: "„Wen im Unternehmen trifft das noch?“" },
      { type: "quote", text: "„Was hat euch das bisher konkret gekostet?“" },
      { type: "label", text: "L3 — Persönlich" },
      { type: "quote", accent: "accent-teal", text: "„Was bedeutet das für dich persönlich?“", cue: "Mund zu. Hier entsteht der emotionale Kaufgrund." },
      { type: "label", text: "L4 — Cost of Inaction" },
      { type: "quote", accent: "accent-red", text: "„In 90 Tagen sind das [X] verpasste Anrufe. Was passiert mit dir persönlich wenn das so weiterläuft?“", cue: "Schweigen. Wer zuerst redet verliert." },
      { type: "gate", items: ["Root Cause in seinen Worten formuliert?", "Schaden konkret spürbar gemacht?", "Persönliche Ebene aktiviert?"] }
    ]
  },
  {
    id: 3, start: 12, title: "Summarize",
    lines: [
      { type: "quote", accent: "accent-teal", text: "„Lass mich kurz zusammenfassen. [Root Cause.] [Schaden.] [Persönliche Ebene.] Hab ich das richtig?“", cue: "Warten bis er aktiv bestätigt. Nicht weitergehen ohne das." },
      { type: "quote", text: "„Ist das das eine Thema — oder drückt gerade noch etwas mehr?“", cue: "Trump Question. Bestätigung oder neuer Pain. Beides ist gut." }
    ]
  },
  {
    id: 4, start: 13.5, title: "Vision",
    lines: [
      { type: "quote", accent: "accent-purple", text: "„Stell dir vor, es ist nächsten Montag früh. Kein Anruf geht verloren. Dein Team macht das wofür du sie bezahlst. Was ändert sich für dich?“", cue: "Schweigen. Er redet. Du facilitierst." },
      { type: "quote", text: "„fonio ist der Puffer zwischen der Außenwelt und deinen Menschen — damit deine Leute dort sind wo sie Wert bringen.“", cue: "Kein weiterer Satz danach. Direkt in den Close." }
    ]
  },
  {
    id: 5, start: 15, title: "Optionen",
    lines: [
      { type: "quote", accent: "accent-amber", text: "„Sasa, ich habe zwei Möglichkeiten für dich.“" },
      { type: "options" },
      { type: "cue", text: "Schweigen. Nicht nachhaken. Wer zuerst redet verliert." },
      { type: "label", text: "Bei Zögern" },
      { type: "quote", text: "„Bind nicht mal deine Hauptnummer an. Starte wo das Telefon 15 Sekunden läutet und keiner rangeht — die Anrufe sind sonst eh weg.“" }
    ]
  },
  {
    id: 6, start: 15.5, title: "Co-Creation",
    lines: [
      { type: "quote", text: "„Welche Anrufe kommen am häufigsten rein?“" },
      { type: "quote", text: "„Wie soll die KI sich vorstellen?“" },
      { type: "quote", text: "„Wohin weiterleiten wenn sie nicht helfen kann?“" },
      { type: "quote", accent: "accent-teal", text: "„Das ist genau der Punkt den du vorhin erwähnt hast.“", cue: "Pain re-ankern bei jedem Feature." },
      { type: "label", text: "ROI live" },
      { type: "quote", accent: "accent-green", text: "„Wie viele Anrufe verpasst du pro Woche? Was ist dein durchschnittlicher Auftragswert? Ein gewonnener Deal im Monat zahlt das Abo.“" },
      { type: "label", text: "DSGVO — nur wenn er fragt" },
      { type: "quote", text: "„Server Nürnberg, Hetzner. Daten verlassen Europa nicht, egal welches Modell. Cognigy und Parloa routen durch die USA.“" }
    ]
  },
  {
    id: 7, start: 24, title: "Close",
    lines: [
      { type: "quote", accent: "accent-green", text: "„Sasa, lass uns das heute aktivieren.“", cue: "Mund zu. Wer zuerst redet verliert." },
      { type: "label", text: "Bei Zögern" },
      { type: "quote", text: "„Was bremst uns das heute zu starten?“", cue: "Mund zu." },
      { type: "label", text: "Bei Preis-Einwand" },
      { type: "quote", text: "„Was kostet euch ein verpasster Anruf? Wie viele passieren pro Woche?“", cue: "Mund zu. 30 Tage Geld zurück — nur wenn er Risiko als Einwand nennt." }
    ]
  }
];

function LineItem({ line }) {
  if (line.type === 'label') return <div className="section-label">{line.text}</div>;
  if (line.type === 'cue') return <div className="quote-cue" style={{ padding: '0 4px', marginBottom: '8px' }}>{line.text}</div>;
  if (line.type === 'pill') return <div className={`pill ${line.accent}`}><div className="pill-dot"></div>{line.text}</div>;
  if (line.type === 'gate') {
    return (
      <div className="gate-box">
        <div className="gate-title">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L13 4V7C13 10.3137 10.3137 13 7 13C3.68629 13 1 10.3137 1 7V4L7 1Z" stroke="#FF9F0A" strokeWidth="1.3"/>
            <path d="M4.5 7L6.5 9L9.5 5.5" stroke="#FF9F0A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Drei-Gate Check — alle drei oder tiefer
        </div>
        {line.items.map((item, i) => <div key={i} className="gate-item">{item}</div>)}
      </div>
    );
  }
  if (line.type === 'options') {
    return (
      <div className="options-grid">
        <div className="option-card"><div className="option-number">Option 1</div><div className="option-title">Demo</div><div className="option-desc">Screen Share, Setup gemeinsam.</div></div>
        <div className="option-card"><div className="option-number">Option 2</div><div className="option-title">Direkt starten</div><div className="option-desc">30-Tage-Test, Kreditkarte, live.</div></div>
      </div>
    );
  }
  return (
    <div className={`quote-block ${line.accent || ''}`}>
      <div className="quote-text">{line.text}</div>
      {line.cue && <div className="quote-cue">{line.cue}</div>}
    </div>
  );
}

function fmt(s) {
  const m = Math.floor(s / 60), sec = s % 60;
  return String(m).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
}

function getSuggested(elapsed) {
  let id = 0;
  PHASES.forEach(p => { if (elapsed >= p.start) id = p.id; });
  return id;
}

export default function CallGuide() {
  const [active, setActive] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (running) {
      intRef.current = setInterval(() => {
        setSeconds(s => {
          if (s >= TOTAL) { clearInterval(intRef.current); setRunning(false); return TOTAL; }
          return s + 1;
        });
      }, 1000);
    } else {
      clearInterval(intRef.current);
    }
    return () => clearInterval(intRef.current);
  }, [running]);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [active]);

  const remaining = TOTAL - seconds;
  const elapsed = seconds / 60;
  const progress = Math.round((seconds / TOTAL) * 100);
  const suggestedId = getSuggested(elapsed);
  const timerColor = remaining < 300 ? "var(--red)" : remaining < 600 ? "var(--amber)" : "var(--text-primary)";
  const activePhase = PHASES[active];

  return (
    <div className="app-container">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      <div className="topbar">
        <div className="topbar-dot"></div>
        <div className="topbar-text">Kann ich seinen Pain präziser beschreiben als er selbst?</div>
      </div>

      <div className="timer-section">
        <div className="timer-row">
          <div className="timer-digits" style={{ color: timerColor }}>{fmt(remaining)}</div>
          <button className={`btn ${running ? 'btn-pause' : 'btn-start'}`} onClick={() => setRunning(!running)}>
            {running ? "PAUSE" : "START"}
          </button>
          <button className="btn btn-reset" onClick={() => { setRunning(false); setSeconds(0); setActive(0); }}>RESET</button>
          <div className="timer-elapsed">+{fmt(seconds)}<br/>ELAPSED</div>
        </div>
        <div className="progress-bg">
          <div className="progress-fill" style={{ width: `${progress}%`, background: timerColor }}></div>
        </div>
      </div>

      <div className="tabs-section">
        {PHASES.map(p => (
          <button key={p.id} onClick={() => setActive(p.id)} className={`tab ${active === p.id ? 'active' : ''} ${suggestedId === p.id && active !== p.id ? 'suggested' : ''}`}>
            {p.title}
          </button>
        ))}
      </div>

      <div className="main-content" ref={contentRef}>
        {active === 0 && (
          <div className="mecca-bar">
            <div className="mecca-bar-icon">◎</div>
            <div>
              <div className="mecca-bar-q">Ja → weiter &nbsp;·&nbsp; Nein → eine Frage tiefer</div>
              <div className="mecca-bar-sub">Interner Check nach jedem Block</div>
            </div>
          </div>
        )}

        {activePhase.lines.map((line, i) => <LineItem key={i} line={line} />)}
        
        {active === PHASES.length - 1 && (
          <div className="footer-note">
            <div className="footer-note-dot"></div>
            <div className="footer-note-text">Platform-Features (API, Webhook, n8n, 20 gleichzeitige Anrufe) — nie einbringen außer er fragt direkt. Post-Close.</div>
          </div>
        )}
      </div>

      <div className="bottom-nav">
        <button className="nav-btn" disabled={active === 0} onClick={() => setActive(a => Math.max(0, a - 1))}>← Zurück</button>
        <div className="nav-status">{active + 1} / {PHASES.length}</div>
        <button className="nav-btn" disabled={active === PHASES.length - 1} onClick={() => setActive(a => Math.min(PHASES.length - 1, a + 1))}>Weiter →</button>
      </div>
    </div>
  );
}
// --- ENDE ---
