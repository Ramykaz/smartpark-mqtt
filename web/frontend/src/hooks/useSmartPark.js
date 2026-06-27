import { useEffect, useRef, useState, useCallback } from 'react'

const WS_URL = `ws://${window.location.host}/ws`
const DEMO_TOTAL = 20

function makeInitialSlots() {
  // ~55% occupied, 35% free, 10% reserved — realistic busy lot
  const weights = ['OCCUPIED','OCCUPIED','OCCUPIED','FREE','FREE','FREE','FREE','OCCUPIED','OCCUPIED','RESERVED']
  const slots = {}
  for (let i = 1; i <= DEMO_TOTAL; i++) {
    const id = `S${String(i).padStart(2, '0')}`
    slots[id] = weights[Math.floor(Math.random() * weights.length)]
  }
  return slots
}

function calcSummary(slots) {
  const vals = Object.values(slots)
  return {
    free:     vals.filter(s => s === 'FREE').length,
    occupied: vals.filter(s => s === 'OCCUPIED').length,
    reserved: vals.filter(s => s === 'RESERVED').length,
    total:    vals.length,
  }
}

function nextState(cur) {
  const r = Math.random()
  if (cur === 'FREE')     return r < 0.65 ? 'OCCUPIED' : r < 0.80 ? 'RESERVED' : 'FREE'
  if (cur === 'OCCUPIED') return r < 0.45 ? 'FREE'     : 'OCCUPIED'
  if (cur === 'RESERVED') return r < 0.70 ? 'OCCUPIED' : 'FREE'
  return 'FREE'
}

export function useSmartPark() {
  const [slots,     setSlots]     = useState({})
  const [summary,   setSummary]   = useState({ free: 0, occupied: 0, reserved: 0, total: 0 })
  const [connected, setConnected] = useState(false)
  const [events,    setEvents]    = useState([])
  const [demoMode,  setDemoMode]  = useState(false)

  const ws             = useRef(null)
  const reconnectTimer = useRef(null)
  const demoInterval   = useRef(null)
  const demoSlotsRef   = useRef({})
  const isDemoRef      = useRef(false)
  const attemptRef     = useRef(0)

  const addEvent = useCallback((slot_id, state) => {
    const ts = new Date().toLocaleTimeString('en-GB', { hour12: false })
    setEvents(prev => [{ slot_id, state, ts }, ...prev].slice(0, 80))
  }, [])

  const startDemo = useCallback(() => {
    if (isDemoRef.current) return
    isDemoRef.current = true
    setDemoMode(true)
    const initial = makeInitialSlots()
    demoSlotsRef.current = { ...initial }
    setSlots({ ...initial })
    setSummary(calcSummary(initial))

    // tick every 900ms, change 1–2 slots
    demoInterval.current = setInterval(() => {
      const ids = Object.keys(demoSlotsRef.current)
      const ticks = Math.random() < 0.4 ? 2 : 1
      let updated = { ...demoSlotsRef.current }
      for (let t = 0; t < ticks; t++) {
        const id  = ids[Math.floor(Math.random() * ids.length)]
        const cur = updated[id]
        const nxt = nextState(cur)
        if (nxt !== cur) {
          updated = { ...updated, [id]: nxt }
          addEvent(id, nxt)
        }
      }
      demoSlotsRef.current = updated
      setSlots(updated)
      setSummary(calcSummary(updated))
    }, 900)
  }, [addEvent])

  const connect = useCallback(() => {
    if (isDemoRef.current) return
    if (ws.current?.readyState === WebSocket.OPEN) return
    const socket = new WebSocket(WS_URL)

    socket.onopen = () => {
      attemptRef.current = 0
      setConnected(true)
    }

    socket.onmessage = (e) => {
      const msg = JSON.parse(e.data)
      if (msg.type === 'snapshot') {
        setSlots(msg.slots || {})
        setSummary(msg.summary || {})
      } else if (msg.type === 'slot') {
        setSlots(prev => ({ ...prev, [msg.slot_id]: msg.state }))
        addEvent(msg.slot_id, msg.state)
      } else if (msg.type === 'summary') {
        setSummary({ free: msg.free, occupied: msg.occupied, reserved: msg.reserved, total: msg.total })
      }
    }

    socket.onclose = () => {
      setConnected(false)
      attemptRef.current += 1
      if (attemptRef.current >= 3) {
        startDemo()
      } else {
        reconnectTimer.current = setTimeout(connect, 2000)
      }
    }

    socket.onerror = () => socket.close()
    ws.current = socket
  }, [addEvent, startDemo])

  useEffect(() => {
    connect()
    return () => {
      clearTimeout(reconnectTimer.current)
      clearInterval(demoInterval.current)
      ws.current?.close()
    }
  }, [connect])

  return { slots, summary, connected, events, demoMode }
}
