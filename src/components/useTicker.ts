import { useEffect, useRef } from "react"

/**
 * Continuous left-gliding carousel ("ticker"). Render the item list three
 * times inside `trackRef`; the hook wraps after one full set so the loop
 * never visibly jumps. Cards must share one width.
 */
export function useTicker({
  count,
  speed,
  running,
  onActive,
  activeBias = 0.35,
}: {
  count: number
  speed: number
  running: boolean
  onActive: (i: number) => void
  activeBias?: number
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLElement>(null)
  const offset = useRef(0)
  const target = useRef<number | null>(null)
  const stepPx = useRef(0)
  const runningRef = useRef(running)
  runningRef.current = running
  const onActiveRef = useRef(onActive)
  onActiveRef.current = onActive

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const measure = () => {
      const track = trackRef.current
      const card = track?.firstElementChild as HTMLElement | null
      const gap = track ? parseFloat(getComputedStyle(track).columnGap) || 0 : 0
      if (card) stepPx.current = card.offsetWidth + gap
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    let shown = -1
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const step = stepPx.current
      const loop = step * count
      if (step) {
        if (target.current !== null) {
          const diff = target.current - offset.current
          offset.current += diff * Math.min(1, dt * 7)
          if (Math.abs(diff) < 0.5) {
            offset.current = target.current
            target.current = null
          }
        } else if (runningRef.current) {
          offset.current += speed * dt
        }
        if (offset.current >= loop) {
          offset.current -= loop
          if (target.current !== null) target.current -= loop
        } else if (offset.current < 0) {
          offset.current += loop
          if (target.current !== null) target.current += loop
        }
        if (trackRef.current)
          trackRef.current.style.transform = `translate3d(${-offset.current}px,0,0)`
        if (barRef.current)
          barRef.current.style.transform = `scaleX(${offset.current / loop})`
        if (target.current === null) {
          const idx = Math.floor((offset.current + step * activeBias) / step) % count
          if (idx !== shown) {
            shown = idx
            onActiveRef.current(idx)
          }
        } else shown = -1
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [count, speed, activeBias])

  /** Glide forward to item i, then keep cruising. */
  const goTo = (i: number) => {
    const step = stepPx.current
    if (!step) return
    const loop = step * count
    let t = i * step
    while (t < offset.current - step / 2) t += loop
    target.current = t
    onActiveRef.current(i)
  }
  /** Glide one card forward or back. */
  const nudge = (dir: 1 | -1) => {
    const step = stepPx.current
    if (!step) return
    const base = target.current ?? offset.current
    const t = (Math.round(base / step) + dir) * step
    target.current = t
    onActiveRef.current(((Math.round(t / step) % count) + count) % count)
  }

  return { viewportRef, trackRef, barRef, goTo, nudge }
}
