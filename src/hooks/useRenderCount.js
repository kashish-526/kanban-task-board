import { useEffect, useRef } from 'react'
import { renderStats } from '../renderStats.js'

// Dev helper: counts how many times a component actually committed a render.
// Used by the stats panel to show that memo() is doing its job.
export function useRenderCount(name) {
  const count = useRef(0)
  count.current += 1
  useEffect(() => {
    renderStats.record(name)
  })
  return count.current
}
