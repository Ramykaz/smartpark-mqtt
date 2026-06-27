import { useEffect, useRef, useState, useCallback } from 'react'

const IS_LOCAL = ['localhost', '127.0.0.1', ''].includes(window.location.hostname)
const WS_PROTO = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
const WS_URL   = `${WS_PROTO}//${window.location.host}/ws`

const DEMO_TOTAL = 20

function makeSlots() {
  const w = ['OCCUPIED','OCCUPIED','OCCUPIED','FREE','FREE','FREE','FREE','OCCUPIED','RESERVED']
  const s = {}
  for (let i = 1; i <= DEMO_TOTAL; i++) {
    s[`S${String(i).padStart(2,'0')}`] = w[Math.floor(Math.random()*w.length)]
  }
  return s
}

function summarise(slots) {
  const v = Object.values(slots)
  return { free: v.filter(x=>x==='FREE').length, occupied: v.filter(x=>x==='OCCUPIED').length, reserved: v.filter(x=>x==='RESERVED').length, total: v.length }
}

function nextState(cur) {
  const r = Math.random()
  if (cur === 'FREE')     return r < 0.60 ? 'OCCUPIED' : r < 0.75 ? 'RESERVED' : 'FREE'
  if (cur === 'OCCUPIED') return r < 0.40 ? 'FREE' : 'OCCUPIED'
  return r < 0.65 ? 'OCCUPIED' : 'FREE'
}

export function useSmartPark() {
  const [slots,     setSlots]     = useState({})
  const [summary,   setSummary]   = useState({ free:0, occupied:0, reserved:0, total:0 })
  const [connected, setConnected] = useState(false)
  const [events,    setEvents]    = useState([])
  const [demoMode,  setDemoMode]  = useState(false)

  const ws           = useRef(null)
  const reconnect    = useRef(null)
  const demoInterval = useRef(null)
  const slotsRef     = useRef({})
  const demoRef      = useRef(false)
  const attemptsRef  = useRef(0)

  const addEvent = useCallback((slot_id, state) => {
    const ts = new Date().toLocaleTimeString('en-GB', { hour12: false })
    setEvents(prev => [{ slot_id, state, ts }, ...prev].slice(0, 100))
  }, [])

  const startDemo = useCallback(() => {
    if (demoRef.current) return
    demoRef.current = true
    setDemoMode(true)
    const initial = makeSlots()
    slotsRef.current = { ...initial }
    setSlots({ ...initial })
    setSummary(summarise(initial))

    demoInterval.current = setInterval(() => {
      const ids = Object.keys(slotsRef.current)
      const count = Math.random() < 0.35 ? 2 : 1
      let next = { ...slotsRef.current }
      for (let i = 0; i < count; i++) {
        const id  = ids[Math.floor(Math.random() * ids.length)]
        const nxt = nextState(next[id])
        if (nxt !== next[id]) { next = { ...next, [id]: nxt }; addEvent(id, nxt) }
      }
      slotsRef.current = next
      setSlots(next)
      setSummary(summarise(next))
    }, 950)
  }, [addEvent])

  const connect = useCallback(() => {
    if (demoRef.current) return
    if (!IS_LOCAL) { startDemo(); return }
    if (ws.current?.readyState === WebSocket.OPEN) return

    let socket
    try { socket = new WebSocket(WS_URL) } catch { startDemo(); return }

    socket.onopen = () => { attemptsRef.current = 0; setConnected(true) }

    socket.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data)
        if (msg.type === 'snapshot') { setSlots(msg.slots||{}); setSummary(msg.summary||{}) }
        else if (msg.type === 'slot') { setSlots(p => ({...p,[msg.slot_id]:msg.state})); addEvent(msg.slot_id, msg.state) }
        else if (msg.type === 'summary') { setSummary({free:msg.free,occupied:msg.occupied,reserved:msg.reserved,total:msg.total}) }
      } catch {}
    }

    socket.onclose = () => {
      setConnected(false)
      attemptsRef.current += 1
      if (attemptsRef.current >= 3) startDemo()
      else reconnect.current = setTimeout(connect, 2000)
    }

    socket.onerror = () => socket.close()
    ws.current = socket
  }, [addEvent, startDemo])

  useEffect(() => {
    connect()
    return () => { clearTimeout(reconnect.current); clearInterval(demoInterval.current); ws.current?.close() }
  }, [connect])

  return { slots, summary, connected, events, demoMode }
}
