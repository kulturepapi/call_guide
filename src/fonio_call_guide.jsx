import { useState, useEffect, useRef } from "react";

const PHASES = [
  {
    id: 0, start: 0, ck: "success",
    label: "Rapport", time: "00:00 – 03:00",
    lines: [
      { t: "line", text: "„Sascha, was war das Highlight deiner Woche?“" },
      { t: "note", text: "Hör zu. Wirklich. Bau darauf auf. Nicht abhaken. Nicht weiter wenn er nicht geantwortet hat." },
      { t: "einwand", text: "Wenn er 'komischer Start' sagt oder resistent ist: „Fair. Lass mich direkt sein.“" },
      { t: "line", text: "„Dein Bruder hat dich empfohlen — er sieht was bei dir passiert. Was passiert gerade bei dir im Café dass du dir heute Zeit dafür nimmst?“" }
    ],
    gate: null,
    forbidden: ["Wetter-Smalltalk", "Pitch-Einstieg"]
  },
  {
    id: 1, start: 3, ck: "success",
    label: "Auslöser", time: "03:00 – 05:00",
    lines: [
      { t: "line", text: "„Du hast fonio gesehen und dich gemeldet — du machst das nicht zum Spaß. Was passiert gerade bei euch?“" },
      { t: "schweigen", text: "← Schweigen. Lass ihn reden." },
      { t: "note", text: "Wenn er sagt 'es ist nicht so schlimm': Nicht widersprechen. Tiefer graben." },
      { t: "line", text: "„Wie läuft das konkret ab wenn das Telefon klingelt und dein Team im Service steht?“" }
    ],
    gate: null, 
    forbidden: []
  },
  {
    id: 2, start: 5, ck: "warning",
    label: "Pain Discovery", time: "05:00 – 09:00",
    lines: [
      { t: "line", text: "„Was passiert konkret wenn fünf Anrufe gleichzeitig reinkommen?“" },
      { t: "line", text: "„Wenn keiner drangeht — ruft der Gast nochmal an oder ist der weg?“" },
      { t: "line", text: "„Wie viele Reservierungen verlierst du geschätzt pro Woche?“" },
      { t: "line", text: "„Was ist ein durchschnittlicher Tisch bei euch wert?“" },
      { t: "schweigen", text: "← Lass ihn rechnen. Seine Zahl hat zehnmal mehr Gewicht als deine." },
      { t: "pflicht", text: "„Warum glaubst du passiert das überhaupt? Was ist die eigentliche Ursache?“ (Orlob Pflichtfrage)" },
      { t: "schweigen", text: "← Schweigen. Wirklich schweigen." },
      { t: "line", text: "„Wie sehr beschäftigt dich das — wenn du weißt dass Gäste nicht reinkommen weil niemand drangegangen ist?“" },
      { t: "line", text: "„Wenn sich das nicht ändert — wo stehst du in zwölf Monaten?“" }
    ],
    gate: "Kann ich seinen Pain präziser beschreiben als Sascha selbst?",
    forbidden: ["Features erwähnen", "Lösung anbieten"]
  },
  {
    id: 3, start: 9, ck: "warning",
    label: "Summarize", time: "09:00 – 11:30",
    lines: [
      { t: "line", text: "„Lass mich sichergehen dass ich das richtig verstanden hab. Du hast 5 Leute die täglich im Service stecken. Das Telefon klingelt oft — keiner geht ran. Du verlierst pro Woche [SEINE ZAHL] Reservierungen. Der Grund ist nicht dass dein Team schlecht ist — sie können nicht 2 Jobs gleichzeitig machen. Hab ich das richtig getroffen?“" },
      { t: "schweigen", text: "← Warten. Nicht weitermachen bis er aktiv bestätigt." },
      { t: "pflicht", text: "„Ist das DAS eine Thema gerade — oder gibt es etwas das dich noch mehr beschäftigt?“" }
    ],
    gate: "Seine eigenen Worte genutzt? Aktiv bestätigt?",
    forbidden: []
  },
  {
    id: 4, start: 11.5, ck: "info",
    label: "Future Viz", time: "11:30 – 14:30",
    lines: [
      { t: "line", text: "„Stell dir vor es ist nächster Montag früh. Dein Team kommt rein. Die Anrufe vom Wochenende — alle beantwortet. Reservierungen gebucht. Öffnungszeiten geklärt. Dein Team macht nur das wofür du sie bezahlst: Gäste empfangen, Kaffee machen. Was verändert das für dich?“" },
      { t: "schweigen", text: "← Lass ihn antworten." },
      { t: "painanker", text: "„fonio ersetzt nicht dein Team. Es ist der Puffer zwischen der Außenwelt und deinen Menschen — damit deine Menschen dort sind wo sie echten Wert bringen.“" },
      { t: "line", text: "„Du hast gerade beschrieben wie dein Café funktioniert wenn kein Anruf mehr verloren geht. Was wäre der erste Schritt den wir heute gemeinsam in die Hände nehmen?“" }
    ],
    gate: "Ist er in der Vision angekommen?",
    forbidden: ["Produkt-Demo von sich aus starten"]
  },
  {
    id: 5, start: 14.5, ck: "danger",
    label: "Zwei Optionen", time: "14:30 – 15:00",
    lines: [
      { t: "line", text: "„Wir haben zwei Möglichkeiten. Ich zeige dir kurz wie fonio für ein Café mit eurem Volumen aussieht. Oder — was die meisten machen die schnell Ergebnisse wollen — wir richten es jetzt gemeinsam ein und du startest die dreißig Tage heute. Was passt dir besser?“" },
      { t: "zoegern", text: "„Du musst nicht mal deine Hauptnummer anbinden. Starte wo das Telefon gerade 15 Sekunden klingelt und keiner rangeht. Diese Anrufe sind sonst eh weg.“" }
    ],
    gate: null, forbidden: []
  },
  {
    id: 6, start: 15, ck: "danger",
    label: "Co-Creation", time: "15:00 – 24:00",
    lines: [
      { t: "pflicht", text: "„Sascha, öffne mal deinen Browser. Ich schick dir deinen persönlichen Setup-Link.“" },
      { t: "line", text: "Schritt 1: „Gib deine Website-URL ein — fonio pulled automatisch deine Öffnungszeiten und Speisekarte.“" },
      { t: "line", text: "Schritt 2: „Jetzt kommt der Prompt. Wir schreiben: 'Wenn es um Catering oder große Reservierungen geht, leite an Sascha weiter.' Das ist deine Nummer?“" },
      { t: "painanker", text: "„Das ist genau der Punkt den du vorhin erwähnt hast — die Catering-Anfragen die durchfallen.“" },
      { t: "note", text: "Kalender: „Die Verknüpfung machen wir nicht live wegen privater Keys. Das ist ein 10-Minuten-Setup heute Abend. fonio funktioniert ab sofort auch ohne.“" },
      { t: "line", text: "In-Demo Fragen: „Was hat am meisten rausgestochen?“ / „Siehst du wie das funktioniert?“" }
    ],
    gate: "Baut er aktiv mit? Ist der Account angelegt?",
    forbidden: ["„Macht das Sinn?“"]
  },
  {
    id: 7, start: 24, ck: "danger",
    label: "Close", time: "24:00 – 30:00",
    lines: [
      { t: "line", text: "„Wir haben das gerade gemeinsam aufgebaut. Lass uns das heute aktivieren.“" },
      { t: "line", text: "„Wenn fonio euch im Monat nur eine einzige dieser verpassten Reservierungen rettet — zahlt sich das Abo von selbst.“" },
      { t: "line", text: "„Dreißig Tage Geld zurück. Das Risiko liegt komplett bei uns.“" },
      { t: "schweigen", text: "← Schweigen." },
      { t: "pflicht", text: "„Sascha, klick auf 'Zahlung'. Du siehst ein Stripe-Fenster — verschlüsselt. Dein Account ist sofort live danach.“" },
      { t: "einwand", text: "ROI / Zu teuer: „Die Frage ist nicht ob 300€ rentabel sind. Die Frage ist ob du es dir leisten kannst weiterhin nicht zu wissen welche Anrufe echte Umsätze waren.“" },
      { t: "einwand", text: "KI-Skepsis: „Das versteh ich. Deshalb zeigen wir es dir jetzt live — nicht mit Zahlen, sondern mit deinem echten Café. Browser auf.“" },
      { t: "einwand", text: "Heute Abend: „Wir sind jetzt beide hier, das Setup dauert 8 Minuten, heute Abend testest du schon real. Was hält uns davon ab?“" },
      { t: "einwand", text: "Bruder: „Er empfiehlt es weil er weiß dass es funktioniert. Aktiviere heute, teste heute Abend mit ihm. Morgen habt ihr Erfahrung statt Theorie.“" }
    ],
    gate: "Closer führen. Verkäufer argumentieren. Browser auf!",
    forbidden: ["Verteidigen", "Vorrechnen", "Argumentieren"]
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
  einwand:   { bg: "rgba(248,113,113,0.1)", color: "#fca5a5", border: "1px solid rgba(248,113,113,0.3)", label: "EINWAND / WIDERSTAND", italic: false },
  painanker: { bg: "rgba(96,165,250,0.1)", color: "#93c5fd", border: "1px solid rgba(96,165,250,0.3)", label: "STRATEGIE / ANKER", italic: false },
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
