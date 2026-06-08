import React from 'react'
import ReactDOM from 'react-dom/client'

// Wir importieren beide Versionen
import CallGuideV1 from './fonio_call_guide.jsx'
import CallGuideV2 from './fonio_call_guide_v2.jsx'

function App() {
  // Wir lesen die URL aus, um zu sehen, welcher Link geklickt wurde
  const urlParams = new URLSearchParams(window.location.search);
  const version = urlParams.get('v');

  // Wenn der Link "?v=2" am Ende hat, lade nur das neue Aaron-Skript
  if (version === '2') {
    return <CallGuideV2 />;
  }

  // Wenn der Link "?v=1" am Ende hat, lade nur das klassische Skript
  if (version === '1') {
    return <CallGuideV1 />;
  }

  // Startseite: Wenn man nur die normale Vercel-Domain öffnet
  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      height: '100vh', background: '#0a0a0a', color: '#e5e5e5', fontFamily: 'sans-serif' 
    }}>
      <h2 style={{ marginBottom: '30px', fontWeight: 'normal' }}>Welches Skript möchtest du laden?</h2>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <a 
          href="?v=1" 
          style={{ 
            padding: '20px 30px', background: '#161616', color: '#60a5fa', 
            textDecoration: 'none', borderRadius: '8px', border: '1px solid #262626',
            fontSize: '16px', fontFamily: 'monospace'
          }}
        >
          LINK 1: V1 (KLASSISCH)
        </a>
        
        <a 
          href="?v=2" 
          style={{ 
            padding: '20px 30px', background: '#161616', color: '#22c55e', 
            textDecoration: 'none', borderRadius: '8px', border: '1px solid #262626',
            fontSize: '16px', fontFamily: 'monospace'
          }}
        >
          LINK 2: V2 (AARON METHODE)
        </a>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
