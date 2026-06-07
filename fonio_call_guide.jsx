import { useState, useEffect, useRef } from "react";

const PHASES = [
  {
    id: 0, start: 0, ck: "success",
    label: "Rapport", time: "00:00 – 03:00",
    lines: [
      { t: "line", text: "„Highlight der Woche?"" },
      { t: "note", text: "Zuhören. Reagieren. 60–90 Sek echte Verbindung." },
      { t: "note", text: "Natürlicher Übergang zum Business — kein direkter Pitch-Einstieg." },
    ],
    gate: null,
    forbidden: ["„Schönes Wochenende?"", "„Bevor wir starten…""]
  },
  {
    id: 1, start: 3, ck: "success",
    label: "Opener", time: "03:00 – 05:00",
    lines: [
      { t: "line", text: "„Ich weiß du hast nicht einfach so angerufen. Was passiert gerade bei euch das dich dazu gebracht hat, das heute anzugehen?"" },
      { t: "line", text: "„Was willst du mit einer KI Telefonassistenz erreichen?"" },
      { t: "line", text: "„Darf ich kurz mit dir zurückgehen? Was war der Moment wo du dir gedacht hast — okay, das muss sich ändern?"" },
    ],
    gate: null, forbidden: []
  },
  {
    id: 2, start: 5, ck: "warning",
    label: "Discovery", time: "05:00 – 10:00",
    lines: [
      { t: "line", text: "„Wie läuft das bei euch ab wenn ein Anruf reinkommt — gibt es da einen festen Ablauf oder ist das eher situativ?"" },
      { t: "line", text: "„Wie viele Anrufe sind das täglich — eher Richtung 75 oder eher Richtung 200?"" },
      { t: "line", text: "„Was sind das meistens für Anrufe — Reparaturstatus, Fehlercodes, Kaufberatung?"" },
      { t: "line", text: "„Was passiert wenn jemand wegen einem Fehlercode anruft und die Leitung gerade besetzt ist?"" },
      { t: "line", text: "„Und wenn niemand abnimmt — was macht der Kunde dann?"" },
      { t: "line", text: "„Habt ihr schon mal versucht das anders zu lösen — Warteschleife, Ansageband, jemand Externes?"" },
      { t: "pflicht", text: "„Warum glaubst du passiert das?"" },
      { t: "line", text: "„Gibt es einen Moment der dir besonders hängengeblieben ist — wo du dir gedacht hast, das darf nicht nochmal passieren?"" },
      { t: "line", text: "„Wer in deinem Team spürt das am meisten — was erleben die täglich konkret?"" },
      { t: "line", text: "„Was können die in dieser Zeit nicht machen?"" },
      { t: "line", text: "„Was schätzt du was euch das unterm Strich kostet — nicht nur in Zahlen, auch in Energie?"" },
      { t: "line", text: "„Wie sieht das in 6 Monaten aus wenn sich nichts ändert?"" },
      { t: "line", text: "„Darf ich direkt fragen — wie sehr beschäftigt dich das?"" },
      { t: "line", text: "„Warum jetzt und nicht in drei Monaten?"" },
    ],
    gate: "Kann ich seinen Pain präziser beschreiben als er selbst?",
    forbidden: []
  },
  {
    id: 3, start: 10, ck: "warning",
    label: "Summarize", time: "10:00 – 11:30",
    lines: [
      { t: "line", text: "„Lass mich kurz checken ob ich das richtig gehört habe. Bei euch gehen täglich Anrufe verloren weil [ROOT CAUSE]. Das kostet euch [KONSEQUENZ]. Und was mich noch mehr trifft: dein Team verbringt den Tag mit Anrufen die immer gleich sind — statt mit den Dingen die wirklich ihre Aufmerksamkeit brauchen. Habe ich das so richtig getroffen?"" },
      { t: "schweigen", text: "← Schweigen. Warten bis er aktiv bestätigt." },
      { t: "line", text: "„Ist das das eine Thema das wir heute lösen — oder drückt dich gerade noch etwas anderes mehr?"" },
    ],
    gate: "Root Cause ✓  Schaden ✓  Persönliche Ebene ✓",
    forbidden: []
  },
  {
    id: 4, start: 11.5, ck: "info",
    label: "Future Viz", time: "11:30 – 15:00",
    lines: [
      { t: "line", text: "„Stell dir vor es ist Montagfrüh. Das Wochenende war voll. Vierzig Anrufe sind reingekommen — Fehlercodes beantwortet, Reparaturstatus gegeben, Termine gebucht. Dein Team kommt rein und fängt direkt mit den Dingen an die wirklich Köpfchen brauchen. Die komplexen Reparaturen, die Beratungsgespräche, die Kunden die wirklich Aufmerksamkeit verdienen."" },
      { t: "schweigen", text: "← Schweigen. Er malt das Bild — nicht unterbrechen." },
      { t: "line", text: "„Was wäre das für dich und dein Team wert?"" },
      { t: "line", text: "„fonio ist kein Roboter der dein Team ersetzt. Es ist der Puffer zwischen der Außenwelt und deinen Menschen — damit sie sich auf die Dinge konzentrieren können wo sie wirklich gebraucht werden."" },
      { t: "line", text: "„Du hast gerade beschrieben wie das aussehen soll. Was wäre der erste Schritt den wir heute dafür angehen?"" },
    ],
    gate: "Er hat aktiv bestätigt. Erst jetzt Zukunft öffnen.",
    forbidden: ["Features", "Produktbeschreibung", "Pitch"]
  },
  {
    id: 5, start: 15, ck: "danger",
    label: "Zwei Optionen", time: "15:00",
    lines: [
      { t: "line", text: "„Wir haben jetzt zwei Möglichkeiten. Ich zeig dir wie fonio funktioniert in einem kurzen Screen Share. Oder wir richten es heute direkt gemeinsam ein und du startest die 30-Tage-Testphase. Was passt dir besser?"" },
      { t: "zoegern", text: "„Bind nicht mal deine Hauptnummer an. Starte dort wo das Telefon 15 Sekunden klingelt und keiner rangeht. Die Anrufe sind sonst eh weg."" },
    ],
    gate: null, forbidden: []
  },
  {
    id: 6, start: 16, ck: "danger",
    label: "Co-Creation", time: "15:00 – 25:00",
    lines: [
      { t: "line", text: "„Darf ich kurz deinen Businessnamen nehmen damit wir das live für dich aufsetzen?"" },
      { t: "line", text: "„Welche Anrufe kommen bei euch am häufigsten rein?"" },
      { t: "line", text: "„Wie soll die KI sich melden?"" },
      { t: "line", text: "„Wohin soll sie weiterleiten wenn sie nicht weiterhilft?"" },
      { t: "line", text: "„Was hat dich bisher am meisten überrascht?"" },
      { t: "line", text: "„Was würde das für dein Team konkret bedeuten?"" },
      { t: "painanker", text: "„Das ist genau der Punkt den du vorhin erwähnt hast."" },
    ],
    gate: null,
    forbidden: ["„Macht das Sinn?"", "„Wäre das wertvoll?"", "Features ungefragt", "DSGVO proaktiv"]
  },
  {
    id: 7, start: 25, ck: "danger",
    label: "Close", time: "25:00 – 30:00",
    lines: [
      { t: "line", text: "„Wir haben das gerade gemeinsam aufgebaut. Lass uns das heute aktivieren."" },
      { t: "line", text: "„30 Tage Geld zurück. Das Risiko liegt komplett bei uns."" },
      { t: "line", text: "„Was kostet euch ein Kunde der aufgelegt hat weil niemand rangegangen ist und dann woanders angerufen hat? Wie viele passieren pro Woche? Das Abo zahlt sich im ersten Kunden der nicht verloren geht."" },
      { t: "zoegern", text: "„Was bremst uns das heute zu starten?" ← Schweigen." },
      { t: "zoegern", text: "„Wen müssen wir noch ins Boot holen?"" },
      { t: "einwand", text: "Zu teuer: „Was kostet euch ein Kunde der woanders angerufen hat? Wie viele pro Woche? Wir reden über einen Bruchteil davon."" },
      { t: "einwand", text: "KI-Einwand: „Genau das Gegenteil. fonio übernimmt die Anrufe die immer gleich sind — damit deine Leute endlich die Dinge angehen können wo sie wirklich gebraucht werden."" },
    ],
    gate: "Hat er mitgebaut? Ist sein Name im Account?",
    forbidden: ["API / Webhook / n8n", "20 gleichzeitige Anrufe"]
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
  pflicht:   { bg: "rgba(245,158,11,0.13)", color: "#fde68a", border: "1px solid rgba(245,158,11,0.4)", label: "⚠ PFLICHT", italic: false },
  schweigen: { bg: "transparent", color: "#4b5563", border: "none", label: null, italic: true },
  zoegern:   { bg: "#1a1a1a", color: "#9ca3af", border: "1px dashed #2e2e2e", label: "BEI ZÖGERN", italic: false },
  einwand:   { bg: "rgba(248,113,113,0.1)", color: "#fca5a5", border: "1px solid rgba(248,113,113,0.3)", label: "EINWAND", italic: false },
  painanker: { bg: "rgba(96,165,250,0.1)", color: "#93c5fd", border: "1px solid rgba(96,165,250,0.3)", label: "PAIN RE-ANKER", italic: false },
  note:      { bg: "transparent", color: "#4b5563", border: "none", label: null, italic: false },
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
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: phase.gate ? 8 : 0 }}>
          <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: acc.text }}>{phase.label.toUpperCase()}</span>
          <span style={{ fontSize: 11, color: "#374151", fontFamily: "monospace" }}>{phase.time}</span>
        </div>
        {phase.gate && (
          <div style={{
            padding: "7px 10px",
            background: "#111",
            borderLeft: `3px solid ${acc.text}`,
            borderRadius: "0 6px 6px 0",
            fontSize: 12, color: "#9ca3af", lineHeight: 1.45
          }}>
            <div style={{ fontSize: 9, fontFamily: "monospace", color: acc.text, marginBottom: 2 }}>GATE</div>
            {phase.gate}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: "0 16px 8px", scrollbarWidth: "thin", scrollbarColor: "#262626 transparent" }}>
        {phase.lines.map((line, i) => <LineItem key={i} line={line} />)}
        {phase.forbidden.length > 0 && (
          <div style={{ marginTop: 10, padding: "8px 11px", background: "rgba(248,113,113,0.08)", borderRadius: 7, border: "1px solid rgba(248,113,113,0.2)" }}>
            <div style={{ fontSize: 9, fontFamily: "monospace", color: "#f87171", marginBottom: 6 }}>NICHT SAGEN</div>
            {phase.forbidden.map((f, i) => (
              <div key={i} style={{ fontSize: 12, color: "#f87171", lineHeight: 1.7, opacity: 0.8 }}>✕ {f}</div>
            ))}
          </div>
        )}
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
