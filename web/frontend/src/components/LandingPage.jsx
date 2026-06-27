const S = {
  // layout
  page:    (dark) => ({ background: dark ? '#0c0e12' : '#f4f6f9', color: dark ? '#c9d1dc' : '#1a202c', minHeight: '100vh', fontFamily: 'inherit' }),
  nav:     (dark) => ({ display: 'flex', alignItems: 'center', padding: '0 40px', height: 52, borderBottom: `1px solid ${dark ? '#1e2330' : '#dde1e8'}`, background: dark ? '#0c0e12' : '#f4f6f9' }),
  divider: (dark) => ({ borderTop: `1px solid ${dark ? '#1e2330' : '#dde1e8'}`, margin: '0 40px' }),
  section: { padding: '56px 40px', maxWidth: 1040, margin: '0 auto' },

  // text
  label:   (dark) => ({ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: dark ? '#4a5568' : '#718096' }),
  h1:      (dark) => ({ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', margin: '12px 0 20px', color: dark ? '#e2e8f0' : '#0f172a' }),
  h2:      (dark) => ({ fontSize: 18, fontWeight: 700, margin: '0 0 8px', color: dark ? '#e2e8f0' : '#0f172a' }),
  body:    (dark) => ({ fontSize: 15, lineHeight: 1.7, color: dark ? '#8896a8' : '#4a5568', maxWidth: 480 }),
  mono:    (dark) => ({ fontFamily: 'monospace', fontSize: 13, color: dark ? '#8896a8' : '#4a5568' }),
  accent:  { color: '#0ea5e9' },
  muted:   (dark) => ({ color: dark ? '#4a5568' : '#9ca3af' }),

  // components
  btn:     (dark) => ({ padding: '9px 20px', fontSize: 13, fontWeight: 600, borderRadius: 6, cursor: 'pointer', border: `1px solid ${dark ? '#2a3244' : '#c5ccd8'}`, background: dark ? '#161b26' : '#edf0f5', color: dark ? '#c9d1dc' : '#374151' }),
  btnPrim: { padding: '9px 20px', fontSize: 13, fontWeight: 600, borderRadius: 6, cursor: 'pointer', border: '1px solid #0ea5e9', background: '#0ea5e9', color: '#fff' },
  card:    (dark) => ({ background: dark ? '#10131a' : '#fff', border: `1px solid ${dark ? '#1e2330' : '#dde1e8'}`, borderRadius: 8, padding: '20px 24px' }),
  tag:     (dark) => ({ display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, border: `1px solid ${dark ? '#2a3244' : '#c5ccd8'}`, color: dark ? '#4a5568' : '#718096', marginRight: 6 }),
}

const QOS = [
  { level: 0, guarantee: 'At-most-once',  latency: '44.6', p95: '131',  dupes: 0  },
  { level: 1, guarantee: 'At-least-once', latency: '61.3', p95: '186',  dupes: 14 },
  { level: 2, guarantee: 'Exactly-once',  latency: '79.7', p95: '226',  dupes: 0  },
]

const ARCH = [
  { name: 'Sensor Nodes',  sub: 'publish at 1 Hz' },
  { name: 'Broker :1883',  sub: 'Mosquitto MQTT'  },
  { name: 'FastAPI :8000', sub: 'MQTT subscriber'  },
  { name: 'WebSocket',     sub: 'push to browser'  },
  { name: 'React UI',      sub: 'live dashboard'   },
]

const STACK = ['Python 3.11', 'Paho MQTT', 'Mosquitto', 'FastAPI', 'React 19', 'WebSocket', 'Recharts', 'SQLite', 'Vite 8']

export default function LandingPage({ dark, setDark, onLaunch }) {
  const bdr = dark ? '#1e2330' : '#dde1e8'
  const txt = dark ? '#c9d1dc' : '#1a202c'
  const mut = dark ? '#4a5568' : '#9ca3af'

  return (
    <div style={S.page(dark)}>

      {/* nav */}
      <nav style={S.nav(dark)}>
        <span style={{ fontSize: 14, fontWeight: 700, color: txt, letterSpacing: '-0.01em' }}>SmartPark MQTT</span>
        <span style={{ ...S.mono(dark), marginLeft: 12, fontSize: 11 }}>BBM 460</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => setDark(d => !d)} style={{ ...S.btn(dark), padding: '5px 10px', fontSize: 12 }}>
            {dark ? 'Light' : 'Dark'}
          </button>
          <a href="https://github.com/Ramykaz/smartpark-mqtt" target="_blank" rel="noopener noreferrer"
            style={{ ...S.btn(dark), textDecoration: 'none', display: 'inline-block' }}>
            GitHub
          </a>
          <button onClick={onLaunch} style={S.btnPrim}>Dashboard →</button>
        </div>
      </nav>

      {/* hero */}
      <div style={{ ...S.section, paddingTop: 72, paddingBottom: 64, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 56, alignItems: 'start' }}>
        <div>
          <span style={S.label(dark)}>Research Project · BBM 460 · 2025</span>
          <h1 style={S.h1(dark)}>SmartPark<br />MQTT</h1>
          <p style={S.body(dark)}>
            An IoT parking management system built on MQTT. Measures message delivery
            and latency across QoS levels 0, 1, and 2 — on both clean and 5% packet-loss
            networks — using 12 controlled experiments across 10, 30, and 50-slot lots.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 28 }}>
            <button onClick={onLaunch} style={S.btnPrim}>Open Dashboard</button>
            <a href="https://github.com/Ramykaz/smartpark-mqtt" target="_blank" rel="noopener noreferrer"
              style={{ ...S.btn(dark), textDecoration: 'none', display: 'inline-block' }}>
              GitHub →
            </a>
          </div>
        </div>

        {/* summary card */}
        <div style={S.card(dark)}>
          <p style={{ ...S.label(dark), marginBottom: 16 }}>Experiment Summary</p>
          {[
            ['Experiments run',    '12'],
            ['QoS levels tested',  '0 / 1 / 2'],
            ['Delivery rate',      '100%'],
            ['Best latency',       '0.4 ms'],
            ['Worst P95',          '226 ms'],
            ['Slot sizes',         '10 · 30 · 50'],
            ['Network conditions', 'clean + 5% loss'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${bdr}` }}>
              <span style={{ fontSize: 13, color: mut }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'monospace', color: txt }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={S.divider(dark)} />

      {/* architecture */}
      <div style={S.section}>
        <p style={{ ...S.label(dark), marginBottom: 24 }}>System Architecture</p>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, overflowX: 'auto', paddingBottom: 8 }}>
          {ARCH.map((node, i) => (
            <div key={node.name} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ textAlign: 'center', minWidth: 120 }}>
                <div style={{ ...S.card(dark), display: 'inline-block', padding: '8px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: txt }}>{node.name}</div>
                </div>
                <div style={{ fontSize: 11, color: mut, marginTop: 6 }}>{node.sub}</div>
              </div>
              {i < ARCH.length - 1 && (
                <div style={{ fontSize: 13, color: mut, margin: '0 4px', paddingBottom: 18, whiteSpace: 'nowrap' }}>
                  {i === 0 ? ' — MQTT → ' : i === 2 ? ' — WS → ' : ' → '}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={S.divider(dark)} />

      {/* qos table */}
      <div style={S.section}>
        <p style={{ ...S.label(dark), marginBottom: 6 }}>QoS Comparison</p>
        <p style={{ ...S.mono(dark), marginBottom: 24 }}>50-slot lot · 1 Hz · 60 s · 5% packet loss (tc-netem)</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['', 'QoS 0', 'QoS 1', 'QoS 2'].map(h => (
                  <th key={h} style={{
                    padding: '8px 16px', textAlign: h === '' ? 'left' : 'center',
                    color: mut, fontWeight: 600, fontSize: 12, letterSpacing: '0.05em',
                    borderBottom: `1px solid ${bdr}`, textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Guarantee',     vals: QOS.map(q => q.guarantee) },
                { label: 'Avg latency',   vals: QOS.map(q => `${q.latency} ms`), hi: true },
                { label: 'P95 latency',   vals: QOS.map(q => `${q.p95} ms`) },
                { label: 'Duplicates',    vals: QOS.map(q => String(q.dupes)) },
                { label: 'Delivery rate', vals: ['100%', '100%', '100%'] },
              ].map(row => (
                <tr key={row.label} style={{ borderBottom: `1px solid ${dark ? '#161b26' : '#f0f2f5'}` }}>
                  <td style={{ padding: '9px 16px', color: mut, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{row.label}</td>
                  {row.vals.map((v, i) => (
                    <td key={i} style={{
                      padding: '9px 16px', textAlign: 'center', fontFamily: 'monospace',
                      color: row.hi && i === 0 ? '#0ea5e9' : txt,
                      fontWeight: row.hi ? 600 : 400,
                    }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...S.mono(dark), marginTop: 16, fontSize: 11 }}>
          Key result: QoS 2 is 1.8× slower than QoS 0 under packet loss — all three levels achieved 100% delivery.
        </p>
      </div>

      <div style={S.divider(dark)} />

      {/* stack + cta */}
      <div style={{ ...S.section, display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center', paddingTop: 40, paddingBottom: 48 }}>
        <div>
          <p style={{ ...S.label(dark), marginBottom: 12 }}>Stack</p>
          <p style={{ fontSize: 14, color: mut, lineHeight: 1.8 }}>
            {STACK.join('  ·  ')}
          </p>
        </div>
        <button onClick={onLaunch} style={{ ...S.btnPrim, padding: '10px 24px', fontSize: 14, whiteSpace: 'nowrap' }}>
          Open Dashboard →
        </button>
      </div>

      {/* footer */}
      <div style={{ ...S.divider(dark) }} />
      <div style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ ...S.mono(dark), fontSize: 12 }}>SmartPark MQTT — BBM 460</span>
        <a href="https://github.com/Ramykaz/smartpark-mqtt" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 12, color: mut, textDecoration: 'none' }}>
          github.com/Ramykaz/smartpark-mqtt
        </a>
      </div>
    </div>
  )
}
