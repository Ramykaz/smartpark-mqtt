const TECH = [
  'Python 3.11', 'Paho MQTT', 'React 19', 'FastAPI', 'WebSocket',
  'Recharts', 'Tailwind CSS', 'SQLite', 'Vite 8',
]

const ARCH_STEPS = [
  { icon: '📡', label: 'Sensor Nodes',    sub: 'Slot simulators\npublish at 1 Hz',  color: '#0ea5e9' },
  { icon: '🔀', label: 'MQTT Broker',     sub: 'Mosquitto :1883\nQoS 0 / 1 / 2',   color: '#6366f1' },
  { icon: '⚡', label: 'FastAPI Bridge',  sub: 'Subscribes & fans\nout via WebSocket', color: '#a78bfa' },
  { icon: '🌐', label: 'WebSocket',       sub: 'Real-time push\nto browser clients', color: '#38bdf8' },
  { icon: '🖥️', label: 'React Dashboard', sub: 'Live grid · stats\n· experiment charts', color: '#22c55e' },
]

const QOS_CARDS = [
  {
    qos: 0, color: '#38bdf8', badge: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.25)',
    title: 'At-Most-Once', latency: '44.6 ms', p95: '131 ms', dupes: 0,
    finding: 'Lowest latency under 5% loss — app-layer retransmission handled externally.',
  },
  {
    qos: 1, color: '#a78bfa', badge: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.25)',
    title: 'At-Least-Once', latency: '61.3 ms', p95: '186 ms', dupes: 14,
    finding: '14 duplicates observed under packet loss — requires deduplication logic.',
  },
  {
    qos: 2, color: '#fb7185', badge: 'rgba(251,113,133,0.12)', border: 'rgba(251,113,133,0.25)',
    title: 'Exactly-Once', latency: '79.7 ms', p95: '226 ms', dupes: 0,
    finding: '4-way handshake adds 1.8× overhead vs QoS 0 — zero duplicates guaranteed.',
  },
]

export default function LandingPage({ dark, setDark, onLaunch }) {
  const bg     = dark ? '#0a0b0f' : '#f8fafc'
  const navBg  = dark ? 'rgba(13,15,20,0.85)' : 'rgba(255,255,255,0.85)'
  const navBdr = dark ? '#1e2228' : '#e2e8f0'
  const text   = dark ? '#e2e8f0' : '#0f172a'
  const muted  = dark ? '#94a3b8' : '#64748b'
  const card   = dark ? '#0d0f14' : '#ffffff'
  const cardBdr= dark ? '#1e2228' : '#e2e8f0'
  const dimBdr = dark ? '#1e2228' : '#f1f5f9'

  return (
    <div style={{ background: bg, color: text, minHeight: '100vh', fontFamily: 'inherit' }}>

      {/* ── Navbar ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', padding: '14px 32px',
        background: navBg, borderBottom: `1px solid ${navBdr}`,
        backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontWeight: 900,
            fontSize: 15, color: '#fff',
            background: 'linear-gradient(135deg,#0ea5e9,#6366f1)',
          }}>P</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1 }}>SmartPark MQTT</div>
            <div style={{ fontSize: 10, color: muted, marginTop: 2 }}>BBM 460 · QoS Performance Research</div>
          </div>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <a
            href="https://github.com/Ramykaz/smartpark-mqtt"
            target="_blank" rel="noopener noreferrer"
            style={{
              fontSize: 12, fontWeight: 600, color: muted, textDecoration: 'none',
              padding: '6px 14px', borderRadius: 8, border: `1px solid ${navBdr}`,
              transition: 'color .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = text}
            onMouseLeave={e => e.currentTarget.style.color = muted}
          >GitHub ↗</a>

          <button onClick={() => setDark(d => !d)} style={{
            width: 34, height: 34, borderRadius: 8, border: `1px solid ${navBdr}`,
            background: dark ? '#1e2228' : '#e2e8f0', cursor: 'pointer',
            color: dark ? '#fbbf24' : '#6366f1', fontSize: 15,
          }}>{dark ? '☀' : '☽'}</button>

          <button onClick={onLaunch} style={{
            padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg,#0ea5e9,#6366f1)',
            color: '#fff', fontSize: 13, fontWeight: 700,
          }}>Dashboard →</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ textAlign: 'center', padding: '96px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        {/* subtle grid bg */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: dark
            ? 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div style={{
          display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', padding: '5px 14px', borderRadius: 100,
          background: dark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', marginBottom: 28,
        }}>IoT Research Project · BBM 460</div>

        <h1 style={{ fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 900, lineHeight: 1.05, margin: 0 }}>
          SmartPark{' '}
          <span style={{
            background: 'linear-gradient(135deg,#0ea5e9 30%,#6366f1 70%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>MQTT</span>
        </h1>

        <p style={{
          fontSize: 18, color: muted, maxWidth: 540, margin: '24px auto 0',
          lineHeight: 1.65,
        }}>
          Real-time IoT parking system built on MQTT — live slot tracking,
          WebSocket telemetry, and QoS reliability research under packet loss.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 44, flexWrap: 'wrap' }}>
          <button onClick={onLaunch} style={{
            padding: '13px 32px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg,#0ea5e9,#6366f1)',
            color: '#fff', fontSize: 15, fontWeight: 700,
            boxShadow: '0 4px 24px rgba(99,102,241,0.35)',
            transition: 'transform .15s, box-shadow .15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.45)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(99,102,241,0.35)' }}
          >🚀 Launch Dashboard</button>

          <a
            href="https://github.com/Ramykaz/smartpark-mqtt"
            target="_blank" rel="noopener noreferrer"
            style={{
              padding: '13px 28px', borderRadius: 10, cursor: 'pointer', textDecoration: 'none',
              background: 'transparent', color: text, fontSize: 15, fontWeight: 600,
              border: `1px solid ${cardBdr}`, display: 'inline-flex', alignItems: 'center', gap: 6,
              transition: 'border-color .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
            onMouseLeave={e => e.currentTarget.style.borderColor = cardBdr}
          >View on GitHub ↗</a>
        </div>
      </section>

      {/* ── Key Stats ── */}
      <section style={{ padding: '0 24px 80px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { value: '100%',  label: 'Message Delivery',   sub: 'All QoS levels · all conditions', color: '#22c55e' },
            { value: '<1 ms', label: 'Avg Latency',        sub: 'Clean network baseline',           color: '#38bdf8' },
            { value: '1.8×',  label: 'QoS 2 Overhead',    sub: 'vs QoS 0 under 5% packet loss',   color: '#fb7185' },
            { value: '12',    label: 'Experiments',        sub: '3 QoS × 3 slot counts + loss',    color: '#a78bfa' },
          ].map(s => (
            <div key={s.label} style={{
              padding: '24px', borderRadius: 16,
              background: card, border: `1px solid ${cardBdr}`,
              borderTop: `3px solid ${s.color}`,
            }}>
              <div style={{ fontSize: 36, fontWeight: 900, fontFamily: 'monospace', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: text, marginTop: 6 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: muted, marginTop: 3 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Architecture ── */}
      <section style={{ padding: '0 24px 80px', maxWidth: 960, margin: '0 auto' }}>
        <SectionHeader title="System Architecture" sub="MQTT message flow from edge sensors to live browser dashboard" dark={dark} />
        <div style={{
          padding: '32px 24px', borderRadius: 16,
          background: card, border: `1px solid ${cardBdr}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexWrap: 'wrap', gap: 0,
        }}>
          {ARCH_STEPS.map((step, i) => (
            <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ textAlign: 'center', padding: '0 8px' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14, margin: '0 auto 10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                  background: `${step.color}18`, border: `1px solid ${step.color}40`,
                }}>{step.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: text }}>{step.label}</div>
                <div style={{ fontSize: 10, color: muted, marginTop: 4, whiteSpace: 'pre-line', lineHeight: 1.5 }}>{step.sub}</div>
              </div>
              {i < ARCH_STEPS.length - 1 && (
                <div style={{ fontSize: 18, color: dark ? '#334155' : '#cbd5e1', margin: '0 4px', paddingBottom: 24 }}>→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── QoS Research ── */}
      <section style={{ padding: '0 24px 80px', maxWidth: 960, margin: '0 auto' }}>
        <SectionHeader title="QoS Research Findings" sub="50-slot lot · 1 Hz · 60 s runs · 5% packet loss via tc-netem" dark={dark} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {QOS_CARDS.map(q => (
            <div key={q.qos} style={{
              padding: 24, borderRadius: 16,
              background: card, border: `1px solid ${q.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{
                  fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 100,
                  background: q.badge, border: `1px solid ${q.border}`, color: q.color,
                }}>QoS {q.qos}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: muted }}>{q.title}</span>
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'monospace', color: q.color }}>{q.latency}</div>
                  <div style={{ fontSize: 10, color: muted }}>Avg latency</div>
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'monospace', color: muted }}>{q.p95}</div>
                  <div style={{ fontSize: 10, color: muted }}>P95 latency</div>
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'monospace', color: q.dupes > 0 ? '#f59e0b' : '#22c55e' }}>{q.dupes}</div>
                  <div style={{ fontSize: 10, color: muted }}>Duplicates</div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: muted, lineHeight: 1.6, margin: 0 }}>{q.finding}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section style={{ padding: '0 24px 80px', maxWidth: 960, margin: '0 auto' }}>
        <SectionHeader title="Tech Stack" sub="Everything used to build and run SmartPark" dark={dark} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {TECH.map(t => (
            <span key={t} style={{
              padding: '6px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: dark ? '#111318' : '#f1f5f9',
              border: `1px solid ${cardBdr}`, color: text,
            }}>{t}</span>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        margin: '0 24px 80px', maxWidth: 960, marginLeft: 'auto', marginRight: 'auto',
        borderRadius: 20, padding: '56px 32px', textAlign: 'center',
        background: dark ? 'linear-gradient(135deg,#0d1117 0%,#0f0b1f 100%)' : 'linear-gradient(135deg,#eff6ff,#f5f3ff)',
        border: `1px solid ${dark ? '#1e2a4a' : '#c7d2fe'}`,
      }}>
        <div style={{ fontSize: 13, color: '#818cf8', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Live Demo</div>
        <h2 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 12px' }}>See it in action</h2>
        <p style={{ color: muted, fontSize: 15, margin: '0 0 36px', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
          The dashboard runs in demo mode when offline — real animations, real data patterns, no backend needed.
        </p>
        <button onClick={onLaunch} style={{
          padding: '14px 36px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg,#0ea5e9,#6366f1)',
          color: '#fff', fontSize: 16, fontWeight: 800,
          boxShadow: '0 4px 28px rgba(99,102,241,0.4)',
          transition: 'transform .15s',
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = ''}
        >Launch Dashboard →</button>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: `1px solid ${dimBdr}`, padding: '24px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ fontSize: 12, color: muted }}>SmartPark MQTT — BBM 460 Research Project</div>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="https://github.com/Ramykaz/smartpark-mqtt" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12, color: muted, textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = text}
            onMouseLeave={e => e.currentTarget.style.color = muted}
          >GitHub ↗</a>
          <button onClick={onLaunch} style={{ fontSize: 12, color: muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = text}
            onMouseLeave={e => e.currentTarget.style.color = muted}
          >Dashboard →</button>
        </div>
      </footer>
    </div>
  )
}

function SectionHeader({ title, sub, dark }) {
  const text  = dark ? '#e2e8f0' : '#0f172a'
  const muted = dark ? '#64748b' : '#94a3b8'
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px', color: text }}>{title}</h2>
      <p style={{ fontSize: 13, color: muted, margin: 0 }}>{sub}</p>
    </div>
  )
}
