import { memo, useSyncExternalStore } from 'react'
import { renderStats } from '../renderStats.js'

const IS_DEV = Boolean(import.meta.env?.DEV)

// Shows how many times each component rendered since the last reset.
// Drag one card and check: only the two affected columns + the moved card should go up.
function RenderStats() {
  useSyncExternalStore(renderStats.subscribe, renderStats.getVersion)
  const counts = renderStats.getCounts()
  const { total, last } = renderStats.getCommits()

  const names = Object.keys(counts).sort()
  const cards = names.filter((n) => n.startsWith('TaskCard'))
  const others = names.filter((n) => !n.startsWith('TaskCard'))
  const cardTotal = cards.reduce((sum, n) => sum + counts[n], 0)

  return (
    <aside className="stats" aria-label="Render statistics">
      <div className="stats-head">
        <strong>Render stats (dev)</strong>
        <button className="btn btn-small" onClick={renderStats.reset}>Reset counters</button>
      </div>
      <p className="stats-hint">
        Press reset, then drag one card to another column. Unchanged components stay at 0.
      </p>
      <ul className="stats-list" data-testid="stats-list">
        {others.map((n) => (
          <li key={n}><span>{n}</span><b>{counts[n]}</b></li>
        ))}
        <li><span>TaskCards (all)</span><b>{cardTotal}</b></li>
      </ul>
      <p className="stats-profiler">
        {IS_DEV
          ? `Profiler: ${total} commits${last ? `, last = ${last.phase}, ${last.actualDuration.toFixed(2)} ms` : ''}`
          : 'Profiler timings are only recorded by React in dev mode (npm run dev)'}
      </p>
    </aside>
  )
}

export default memo(RenderStats)
