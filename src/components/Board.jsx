import { memo } from 'react'
import Column from './Column.jsx'
import { COLUMN_ORDER } from '../reducer/initialData.js'
import { useRenderCount } from '../hooks/useRenderCount.js'

function Board({ columns, query, showStats, onDelete, onEdit, onMove, onClearDone }) {
  const renders = useRenderCount('Board')

  return (
    <main className="board">
      {showStats && <span className="render-badge board-badge">Board r:{renders}</span>}
      {COLUMN_ORDER.map((colId, i) => (
        <Column
          key={colId}
          column={columns[colId]}
          prevColumnId={COLUMN_ORDER[i - 1]}
          nextColumnId={COLUMN_ORDER[i + 1]}
          query={query}
          showStats={showStats}
          onDelete={onDelete}
          onEdit={onEdit}
          onMove={onMove}
          onClearDone={onClearDone}
        />
      ))}
    </main>
  )
}

export default memo(Board)
