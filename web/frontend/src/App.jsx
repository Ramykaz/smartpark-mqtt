import { useState } from 'react'
import { useSmartPark }   from './hooks/useSmartPark'
import LandingPage        from './components/LandingPage'
import ParkingLot         from './components/ParkingLot'
import ExperimentsTable   from './components/ExperimentsTable'
import LogViewer          from './components/LogViewer'

const TABS = [
  { id: 'live',        label: 'Live' },
  { id: 'experiments', label: 'Experiments' },
  { id: 'logs',        label: 'Logs' },
]

function stateColor(s) {
  if (s === 'FREE')     return '#3fb950'
  if (s === 'OCCUPIED') return '#f85149'
  return '#d29922'
}

export default function App() {
  const [page, setPage] = useState('home')
  const [tab,  setTab]  = useState('live')
  const [dark, setDark] = useState(true)
  const { slots, summary, connected, events, demoMode } = useSmartPark()

  const bg  = dark ? '#0f1117' : '#f6f8fa'
  const bdr = dark ? '#21262d' : '#d0d7de'
  const txt = dark ? '#c9d1d9' : '#1f2328'
  const mut = dark ? '#8b949e' : '#636c76'
  const sf  = dark ? '#161b22' : '#ffffff'

  if (page === 'home') return <LandingPage dark={dark} setDark={setDark} onLaunch={() => setPage('dashboard')} />

  const statusText = demoMode ? 'demo' : connected ? 'live' : 'offline'
  const statusCol  = demoMode ? '#d29922' : connected ? '#3fb950' : '#f85149'

  return (
    <div style={{ background: bg, color: txt, height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'inherit', overflow: 'hidden' }}>

      {/* nav — 44px */}
      <header style={{ height: 44, display: 'flex', alignItems: 'center', borderBottom: `1px solid ${bdr}`, flexShrink: 0, background: sf }}>
        <button onClick={() => setPage('home')} style={{ padding: '0 16px', height: '100%', fontSize: 13, fontWeight: 600, color: txt, background: 'none', border: 'none', borderRight: `1px solid ${bdr}`, cursor: 'pointer' }}>
          SmartPark MQTT
        </button>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '0 16px', height: '100%', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            color: tab === t.id ? txt : mut, background: 'none', border: 'none',
            borderBottom: `2px solid ${tab === t.id ? '#388bfd' : 'transparent'}`,
          }}>{t.label}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 0 }}>
          <span style={{ padding: '0 16px', fontSize: 12, color: statusCol, fontFamily: 'monospace', borderLeft: `1px solid ${bdr}`, height: 44, display: 'flex', alignItems: 'center' }}>
            ● {statusText}
          </span>
          <button onClick={() => setDark(d => !d)} style={{ padding: '0 14px', height: 44, fontSize: 12, color: mut, background: 'none', border: 'none', borderLeft: `1px solid ${bdr}`, cursor: 'pointer' }}>
            {dark ? 'Light' : 'Dark'}
          </button>
        </div>
      </header>

      {/* live tab */}
      {tab === 'live' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* stats strip — 40px */}
          <div style={{ height: 40, display: 'flex', borderBottom: `1px solid ${bdr}`, flexShrink: 0 }}>
            {[
              { label: 'FREE',     val: summary.free,     col: '#3fb950' },
              { label: 'OCCUPIED', val: summary.occupied, col: '#f85149' },
              { label: 'RESERVED', val: summary.reserved, col: '#d29922' },
              { label: 'TOTAL',    val: summary.total,    col: txt },
            ].map((s, i, arr) => (
              <div key={s.label} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', borderRight: i < arr.length - 1 ? `1px solid ${bdr}` : 'none' }}>
                <span style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: s.col, lineHeight: 1 }}>{s.val}</span>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: mut }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* parking + events */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
              <ParkingLot slots={slots} dark={dark} />
            </div>
            <div style={{ width: 208, borderLeft: `1px solid ${bdr}`, overflow: 'auto', flexShrink: 0 }}>
              <div style={{ padding: '10px 14px 6px', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: mut, borderBottom: `1px solid ${bdr}` }}>
                Events
              </div>
              {events.length === 0
                ? <p style={{ padding: '12px 14px', fontSize: 12, color: mut }}>No events yet</p>
                : events.map((e, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, padding: '4px 14px', fontFamily: 'monospace', fontSize: 11, borderBottom: i === 0 ? `1px solid ${bdr}` : 'none', background: i === 0 ? (dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)') : 'transparent' }}>
                    <span style={{ color: mut, flexShrink: 0 }}>{e.ts.slice(0, 8)}</span>
                    <span style={{ color: txt, flexShrink: 0 }}>{e.slot_id}</span>
                    <span style={{ color: stateColor(e.state) }}>{e.state.slice(0,3)}</span>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}

      {/* experiments tab */}
      {tab === 'experiments' && (
        <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: txt }}>Experiment Results</h2>
              <p style={{ fontSize: 13, color: mut, margin: 0 }}>12 runs · QoS 0 / 1 / 2 · clean network and 5% packet loss</p>
            </div>
            <ExperimentsTable dark={dark} />
          </div>
        </div>
      )}

      {/* logs tab */}
      {tab === 'logs' && (
        <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: txt }}>System Logs</h2>
              <p style={{ fontSize: 13, color: mut, margin: 0 }}>Controller output · experiment runs · error traces</p>
            </div>
            <LogViewer dark={dark} />
          </div>
        </div>
      )}
    </div>
  )
}
