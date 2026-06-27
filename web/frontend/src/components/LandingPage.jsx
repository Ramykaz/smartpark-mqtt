import { useIsMobile } from '../hooks/useIsMobile'

const STACK = ['Python 3.11', 'Paho MQTT', 'Mosquitto', 'FastAPI', 'React 19', 'WebSocket', 'SQLite', 'Vite 8']

export default function LandingPage({ dark, setDark, onLaunch }) {
  const mobile = useIsMobile()
  const bg  = dark ? '#0f1117' : '#f6f8fa'
  const sf  = dark ? '#161b22' : '#ffffff'
  const bdr = dark ? '#21262d' : '#d0d7de'
  const txt = dark ? '#c9d1d9' : '#1f2328'
  const mut = dark ? '#8b949e' : '#636c76'
  const sidePad = mobile ? 18 : 32

  const btn  = { padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: `1px solid ${bdr}`, background: sf, color: txt, borderRadius: 4 }
  const btnP = { padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: '1px solid #388bfd', background: '#388bfd', color: '#fff', borderRadius: 4 }
  const lbl  = { fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: mut }

  return (
    <div style={{ background: bg, color: txt, minHeight: '100vh', fontFamily: 'inherit' }}>

      {/* nav */}
      <nav style={{ height: 44, display: 'flex', alignItems: 'center', padding: `0 ${sidePad}px`, borderBottom: `1px solid ${bdr}`, background: sf, overflowX: 'auto' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: txt, whiteSpace: 'nowrap' }}>SmartPark MQTT</span>
        {!mobile && <span style={{ marginLeft: 10, fontSize: 11, fontFamily: 'monospace', color: mut }}>BBM 460</span>}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: mobile ? 6 : 8, alignItems: 'center', flexShrink: 0 }}>
          <button onClick={() => setDark(d => !d)} style={btn}>{dark ? 'Light' : 'Dark'}</button>
          {!mobile && (
            <a href="https://github.com/Ramykaz/smartpark-mqtt" target="_blank" rel="noopener noreferrer"
              style={{ ...btn, textDecoration: 'none' }}>GitHub</a>
          )}
          <button onClick={onLaunch} style={btnP}>Dashboard</button>
        </div>
      </nav>

      {/* hero */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: mobile ? '40px 18px 48px' : '80px 32px 72px', display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 300px', gap: mobile ? 32 : 56, alignItems: 'start' }}>
        <div>
          <span style={lbl}>Research Project · BBM 460 · 2025</span>
          <h1 style={{ fontSize: 'clamp(28px, 7vw, 46px)', fontWeight: 700, margin: '14px 0 18px', letterSpacing: '-0.02em', lineHeight: 1.15, color: txt }}>
            SmartPark MQTT
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: mut, maxWidth: 480, margin: '0 0 32px' }}>
            An IoT parking management system built on MQTT. Measures message delivery
            and latency across QoS levels 0, 1, and 2 on clean and 5% packet-loss
            networks using 12 controlled experiments across 10, 30, and 50-slot lots.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={onLaunch} style={btnP}>Open Dashboard</button>
            <a href="https://github.com/Ramykaz/smartpark-mqtt" target="_blank" rel="noopener noreferrer"
              style={{ ...btn, textDecoration: 'none' }}>GitHub →</a>
          </div>
        </div>

        {/* summary */}
        <div style={{ background: sf, border: `1px solid ${bdr}` }}>
          <div style={{ padding: '10px 16px', borderBottom: `1px solid ${bdr}`, ...lbl }}>
            Experiment Summary
          </div>
          {[
            ['Experiments',         '12 runs'],
            ['QoS levels',          '0 / 1 / 2'],
            ['Delivery rate',       '100%'],
            ['Best latency',        '0.4 ms'],
            ['Worst P95',           '226 ms'],
            ['Slot configurations', '10 · 30 · 50'],
            ['Networks',            'clean + 5% loss'],
          ].map(([k, v], i, arr) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 16px', borderBottom: i < arr.length - 1 ? `1px solid ${bdr}` : 'none' }}>
              <span style={{ fontSize: 13, color: mut }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'monospace', color: txt }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* QoS table */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: `0 ${sidePad}px ${mobile ? 48 : 72}px` }}>
        <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', alignItems: mobile ? 'flex-start' : 'baseline', gap: mobile ? 4 : 16, marginBottom: 14 }}>
          <span style={lbl}>QoS Comparison</span>
          <span style={{ fontSize: 12, fontFamily: 'monospace', color: mut }}>50-slot lot · 1 Hz · 60 s · 5% packet loss</span>
        </div>
        <div style={{ border: `1px solid ${bdr}`, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: sf }}>
                {['', 'QoS 0', 'QoS 1', 'QoS 2'].map((h, i) => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: i === 0 ? 'left' : 'center', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: mut, borderBottom: `1px solid ${bdr}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Guarantee',     vals: ['At-most-once', 'At-least-once', 'Exactly-once'] },
                { label: 'Avg latency',   vals: ['44.6 ms', '61.3 ms', '79.7 ms'], accent: true },
                { label: 'P95 latency',   vals: ['131 ms', '186 ms', '226 ms'] },
                { label: 'Duplicates',    vals: ['0', '14', '0'] },
                { label: 'Delivery rate', vals: ['100%', '100%', '100%'] },
              ].map((row, ri, arr) => (
                <tr key={row.label} style={{ borderBottom: ri < arr.length - 1 ? `1px solid ${bdr}` : 'none' }}>
                  <td style={{ padding: '9px 16px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: mut }}>{row.label}</td>
                  {row.vals.map((v, i) => (
                    <td key={i} style={{ padding: '9px 16px', textAlign: 'center', fontFamily: 'monospace', color: row.accent && i === 0 ? '#388bfd' : txt, fontWeight: row.accent ? 600 : 400 }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: 10, fontSize: 12, fontFamily: 'monospace', color: mut }}>
          QoS 2 is 1.8× slower than QoS 0 under packet loss. All three levels achieved 100% delivery.
        </p>
      </div>

      {/* stack + CTA */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: `0 ${sidePad}px ${mobile ? 48 : 72}px`, display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'center', gap: mobile ? 20 : 32 }}>
        <div>
          <span style={lbl}>Stack</span>
          <p style={{ marginTop: 10, fontSize: 13, color: mut, lineHeight: 1.9 }}>
            {STACK.join('  ·  ')}
          </p>
        </div>
        <button onClick={onLaunch} style={{ ...btnP, padding: '10px 24px', fontSize: 14, whiteSpace: 'nowrap' }}>
          Open Dashboard →
        </button>
      </div>

      {/* footer */}
      <div style={{ borderTop: `1px solid ${bdr}`, padding: mobile ? '14px 18px' : '14px 32px', display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'center', gap: mobile ? 6 : 0 }}>
        <span style={{ fontSize: 12, fontFamily: 'monospace', color: mut }}>SmartPark MQTT — BBM 460</span>
        <a href="https://github.com/Ramykaz/smartpark-mqtt" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 12, color: mut, textDecoration: 'none' }}>
          github.com/Ramykaz/smartpark-mqtt
        </a>
      </div>
    </div>
  )
}
