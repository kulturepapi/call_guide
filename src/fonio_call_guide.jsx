import { useState, useEffect, useRef } from "react";

const PHASES = [
  {
    id: 0, start: 0, ck: "success",
    label: "Rapport", time: "00:00 – 03:00",
    lines: [
      { t: "line", text: "„Sasa, hey — Dersim hier von fonio, schön dass wir uns heute sprechen. Wie war dein Tag bis jetzt?“" },
      { t: "schweigen", text: "← [Er antwortet]" },
      { t: "line", text: "„Ja, ich kenn das — bei uns im Office ist's genauso. Gut dass du dir heute Zeit nimmst.“" }
    ],
    gate: null, forbidden: []
  },
  {
    id: 1, start: 3, ck: "success",
    label: "Opener", time: "03:00 – 05:00",
    lines: [
      { t: "line", text: "„Sasa, du hast nicht zum Spaß angerufen. Was passiert gerade bei euch, dass du dir gedacht hast — okay, ich schau mir das jetzt an?“" },
      { t: "schweigen", text: "← [Er antwortet]" },
      { t: "line", text: "„Und was wäre für dich das ideale Ergebnis aus dem heutigen Gespräch?“" },
      { t: "schweigen", text: "← [Er antwortet]" },
      { t: "line", text: "„Gut. Darf ich dich kurz ein bisschen zurückführen — bevor wir über Lösungen reden?“" }
    ],
    gate: null, forbidden: []
  },
  {
    id: 2, start: 5, ck: "warning",
    label: "Discovery", time: "05:00 – 12:00",
    lines: [
      { t: "line", text: "„Was passiert konkret bei euch, wenn niemand rangeht?“" },
      { t: "schweigen", text: "← [Er antwortet — Mund zu]" },
      { t: "line", text: "„Warum passiert das eigentlich? Was steckt da dahinter?“" },
      { t: "schweigen", text: "← [Er antwortet — Mund zu]" },
      { t: "line", text: "„Was habt ihr bisher versucht um das zu lösen?“" },
      { t: "schweigen", text: "← [Er antwortet — Mund zu]" },
      { t: "line", text: "„Was schätzt du — wie viele Anrufe gehen euch pro Tag verloren? Und was ist ein verpasster Anruf bei euch wert?“" },
      { t: "schweigen", text: "← [Er antwortet — Mund zu]" },
      { t: "line", text: "„Wie lange trägst du das schon?“" },
      { t: "schweigen", text: "← [Er antwortet — Mund zu]" }
    ],
    gate: null, forbidden: []
  },
  {
    id: 3, start: 12, ck: "warning",
    label: "Summarize", time: "12:00 – 13:30",
    lines: [
      { t: "line", text: "„Sasa, lass mich kurz zusammenfassen was ich gehört habe. Ihr bekommt täglich zwischen 75 und 200 Anrufe. Ein Großteil davon sind Fragen die euer Team eigentlich gar nicht beantworten müsste — Öffnungszeiten, Routing, FAQ. Gleichzeitig gehen Anrufe verloren weil das Team im Tagesgeschäft steckt. Das kostet euch direkt Umsatz — und dein Team spürt den Druck. Hab ich das richtig?“" },
      { t: "schweigen", text: "← [Warten bis er aktiv bestätigt]" },
      { t: "line", text: "„Ist das das eine Thema — oder drückt gerade noch etwas mehr?“" }
    ],
    gate: null, forbidden: []
  },
  {
    id: 4, start: 13.5, ck: "info",
    label: "Future Viz", time: "13:30 – 15:00",
    lines: [
      { t: "line", text: "„Stell dir vor, es ist nächsten Montag früh. Das Wochenende war voll mit Anrufen — aber alles wurde beantwortet. Öffnungszeiten, Weiterleitungen, FAQ — alles dokumentiert, nichts verloren. Dein Team kommt rein und macht das wofür du sie bezahlst. Was ändert sich für dich persönlich?“" },
      { t: "schweigen", text: "← [Er antwortet — Mund zu]" },
      { t: "line", text: "„Genau das ist fonio. Kein Roboter der dein Team ersetzt — der Puffer zwischen der Außenwelt und deinen Menschen. Dein Team macht endlich das wofür du sie bezahlst.“" }
    ],
    gate: null, forbidden: []
  },
  {
    id: 5, start: 15, ck: "danger",
    label: "Optionen", time: "15:00",
    lines: [
      { t: "line", text: "„Sasa, wir haben zwei Möglichkeiten. Ich zeig dir fonio kurz im Screen Share — oder wir richten heute direkt deinen Account ein und du startest die 30-Tage-Testphase. Was passt dir besser?“" },
      { t: "zoegern", text: "Bei Zögern: „Bind nicht mal deine Hauptnummer an. Starte dort wo das Telefon gerade 15 Sekunden läutet und keiner rangeht. Die Anrufe sind sonst eh weg.“" }
    ],
    gate: null, forbidden: []
  },
  {
    id: 6, start: 15.5, ck: "danger",
    label: "Co-Creation", time: "15:00 – 25:00",
    lines: [
      { t: "pflicht", text: "„Gut — Browser auf, ich schick dir den Link.“" },
      { t: "schweigen", text: "← [Er baut mit — du führst]" },
      { t: "line", text: "„Was hat dich bisher am meisten überrascht?“" },
      { t: "painanker", text: "Bei jedem Feature: „Das ist genau der Punkt den du vorhin erwähnt hast.“" },
      { t: "einwand", text: "DSGVO (Nur wenn er fragt): „Alle Daten bleiben in Europa — Server Nürnberg, Hetzner Rechenzentrum. Daten verlassen Europa nicht. Cognigy und Parloa routen durch die USA — bei uns ist das kein Thema.“" }
    ],
    gate: null, forbidden: []
  },
  {
    id: 7, start: 25, ck: "danger",
    label: "Close", time: "25:00 – 30:00",
    lines: [
      { t: "line", text: "„Sasa, wir haben das gerade gemeinsam aufgebaut. Ein gewonnener Deal im Monat zahlt das Abo von selbst. 30 Tage Geld zurück — das Risiko liegt komplett bei uns. Lass uns das heute aktivieren.“" },
      { t: "pflicht", text: "← [Mund zu — wer zuerst redet verliert]" },
      { t: "einwand", text: "Bei Einwand: „Was bremst uns das heute zu starten?“ → [Mund zu]" },
      { t: "einwand", text: "Bei Preis: „Was kostet euch ein verpasster Anruf? Wie viele passieren pro Woche?“ → [Mund zu]" },
      { t: "note", text: "MANTRA: Frage stellen. Zurücklehnen. Schweigen." }
    ],
    gate: null, forbidden: []
  },
];

const ACCENT = {
  success: { text: "#22c55e", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.35)" },
  warning: { text: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.35)" },
  info:    { text: "#60a5fa", bg: "rgba(96,165,250,0.12)", border: "rgba(96,165,250,0.35)" },
  danger:  { text: "#f87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.35)" },
};

const LINE_STYLE = {
  line:      { bg: "#161616", color: "#d1d5db", border: "1px solid #262626", label: null, italic: false },
  pflicht:   { bg: "rgba(245,158,11,0.13)", color: "#fde68a", border: "1px solid rgba(245,158,11,0.4)", label: "⚠ AKTION", italic: false },
  schweigen: { bg: "transparent", color: "#60a5fa", border: "none", label: null, italic: true },
  zoegern:   { bg: "#1a1a1a", color: "#9ca3af", border: "1px dashed #2e2e2e", label: "BEI ZÖGERN", italic: false },
  einwand:   { bg: "rgba(248,113,113,0.1)", color: "#fca5a5", border: "1px solid rgba(248,113,113,0.3)", label: "EINWAND / WIDERSTAND", italic: false },
  painanker: { bg: "rgba(96,165,250,0.1)", color: "#93c5fd", border: "1px solid rgba(96,165,250,0.3)", label: "STRATEGIE", italic: false },
  note:      { bg: "transparent", color: "#9ca3af", border: "none", label: null, italic: false },
};

function LineItem({ line }) {
  const s = LINE_STYLE[line.t] || LINE_STYLE.line;
  return (
    <div style={{
      marginBottom: 5, padding: "9px 11px",
      borderRadius: 7, background: s.bg, color: s.color,
      border: s.border, fontSize: 13, lineHeight: 1.6,
      fontStyle: s.italic ? "italic" : "normal"
    }}>
      {s.label && (
        <div style={{ fontSize: 9, fontFamily: "monospace", marginBottom: 3, opacity: 0.7 }}>
          {s.label}
        </div>
      )}
      {line.text}
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
  const TOTAL = 1800;

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
  const phase = PHASES[active];
  const acc = ACCENT[phase.ck];

  const timerColor = remaining < 300 ? "#f87171" : remaining < 600 ? "#f59e0b" : "#e5e5e5";

  const reset = () => {
    clearInterval(intRef.current);
    setRunning(false);
    setSeconds(0);
    setActive(0);
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh",
      overflow: "hidden", background: "#0a0a0a", color: "#e5e5e5",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: 14, boxSizing: "border-box"
    }}>

      {/* TIMER */}
      <div style={{ padding: "13px 16px 10px", borderBottom: "1px solid #1a1a1a", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ fontFamily: "monospace", fontSize: 32, fontWeight: 700, color: timerColor, letterSpacing: "-1px", lineHeight: 1, minWidth: 95 }}>
            {fmt(remaining)}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => setRunning(r => !r)}
              style={{ padding: "5px 13px", fontSize: 12, fontFamily: "monospace", cursor: "pointer", background: running ? "rgba(248,113,113,0.15)" : "rgba(34,197,94,0.15)", color: running ? "#f87171" : "#22c55e", border: `1px solid ${running ? "rgba(248,113,113,0.4)" : "rgba(34,197,94,0.4)"}`, borderRadius: 5 }}
            >
              {running ? "PAUSE" : "START"}
            </button>
            <button
              onClick={reset}
              style={{ padding: "5px 10px", fontSize: 12, fontFamily: "monospace", cursor: "pointer", background: "transparent", color: "#4b5563", border: "1px solid #262626", borderRadius: 5 }}
            >
              RESET
            </button>
          </div>
          <div style={{ marginLeft: "auto", fontFamily: "monospace", fontSize: 10, color: "#374151", textAlign: "right", lineHeight: 1.5 }}>
            +{fmt(seconds)}<br /><span style={{ fontSize: 9 }}>ELAPSED</span>
          </div>
        </div>
        <div style={{ height: 3, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: progress + "%", background: timerColor, borderRadius: 2, transition: "width 1s linear" }} />
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: 3, padding: "8px 12px", borderBottom: "1px solid #1a1a1a", overflowX: "auto", flexShrink: 0, scrollbarWidth: "none" }}>
        {PHASES.map(p => {
          const isActive = active === p.id;
          const isSuggested = suggestedId === p.id && !isActive;
          const a = ACCENT[p.ck];
          return (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              style={{
                flexShrink: 0, padding: "4px 10px", borderRadius: 5,
                fontSize: 11, fontFamily: "monospace", cursor: "pointer",
                transition: "all 0.15s",
                background: isActive ? a.bg : "transparent",
                color: isActive ? a.text : isSuggested ? a.text : "#374151",
                border: isActive ? `1px solid ${a.border}` : isSuggested ? `1px dashed ${a.border}` : "1px solid transparent",
                fontWeight: isActive ? 700 : 400,
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* PHASE HEADER */}
      <div style={{ padding: "10px 16px 8px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: acc.text }}>{phase.label.toUpperCase()}</span>
          <span style={{ fontSize: 11, color: "#374151", fontFamily: "monospace" }}>{phase.time}</span>
        </div>
      </div>

      {/* CONTENT */}
      <div ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: "0 16px 8px", scrollbarWidth: "thin", scrollbarColor: "#262626 transparent" }}>
        {phase.lines.map((line, i) => <LineItem key={i} line={line} />)}
      </div>

      {/* NAV */}
      <div style={{ display: "flex", gap: 8, padding: "8px 16px 12px", borderTop: "1px solid #1a1a1a", flexShrink: 0, alignItems: "center" }}>
        <button
          onClick={() => setActive(a => Math.max(0, a - 1))}
          disabled={active === 0}
          style={{ flex: 1, padding: "7px 0", fontSize: 12, fontFamily: "monospace", cursor: active === 0 ? "default" : "pointer", background: "transparent", color: active === 0 ? "#262626" : "#6b7280", border: "1px solid #1f1f1f", borderRadius: 5 }}
        >
          ← Zurück
        </button>
        <div style={{ fontFamily: "monospace", fontSize: 10, color: "#374151", whiteSpace: "nowrap" }}>
          {active + 1}/{PHASES.length}
        </div>
        <button
          onClick={() => setActive(a => Math.min(PHASES.length - 1, a + 1))}
          disabled={active === PHASES.length - 1}
          style={{ flex: 1, padding: "7px 0", fontSize: 12, fontFamily: "monospace", cursor: active === PHASES.length - 1 ? "default" : "pointer", background: "transparent", color: active === PHASES.length - 1 ? "#262626" : "#6b7280", border: "1px solid #1f1f1f", borderRadius: 5 }}
        >
          Weiter →
        </button>
      </div>
    </div>
  );
}
