import { memo, useMemo, useState, useRef } from 'react'
import TaskCard from './TaskCard.jsx'
import { useRenderCount } from '../hooks/useRenderCount.js'

const ICONS = { todo: '📝', inprogress: '🚀', done: '✅' }

function Column({ column, prevColumnId, nextColumnId, query, showStats, onDelete, onEdit, onMove, onClearDone }) {
  const renders = useRenderCount(`Column ${column.id}`)
  // which card the dragged card would be dropped above ('end' = bottom of the list)
  const [dropBefore, setDropBefore] = useState(null)
  const listRef = useRef(null)

  // only recalculated when this column's tasks or the search text change
  const visibleTasks = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return column.tasks
    return column.tasks.filter(
      (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    )
  }, [column.tasks, query])

  const handleDragOver = (e) => {
    e.preventDefault() // needed, otherwise the drop event never fires
    e.dataTransfer.dropEffect = 'move'

    // find the first card whose middle is below the mouse
    const cards = listRef.current.querySelectorAll('[data-task-id]:not(.dragging)')
    let target = 'end'
    for (const card of cards) {
      const box = card.getBoundingClientRect()
      if (e.clientY < box.top + box.height / 2) {
        target = card.dataset.taskId
        break
      }
    }
    setDropBefore(target) // same value = React skips the re-render
  }

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setDropBefore(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('text/plain')
    if (taskId) onMove(taskId, column.id, dropBefore === 'end' ? null : dropBefore)
    setDropBefore(null)
  }

  return (
    <section
      className={`column column-${column.id} ${dropBefore ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-label={column.title}
    >
      <header className="column-header">
        <h2>
          <span className="col-icon">{ICONS[column.id]}</span> {column.title} <span className="count">{column.tasks.length}</span>
        </h2>
        {showStats && <span className="render-badge">r:{renders}</span>}
        {column.id === 'done' && column.tasks.length > 0 && (
          <button className="btn btn-small" onClick={onClearDone}>Clear</button>
        )}
      </header>

      <ul className="card-list" ref={listRef}>
        {visibleTasks.map((task) => (
          <TaskCardWithIndicator
            key={task.id}
            show={dropBefore === task.id}
            task={task}
            columnId={column.id}
            prevColumnId={prevColumnId}
            nextColumnId={nextColumnId}
            onDelete={onDelete}
            onEdit={onEdit}
            onMove={onMove}
            showStats={showStats}
          />
        ))}
        {dropBefore === 'end' && <li className="drop-line" aria-hidden="true" />}
        {visibleTasks.length === 0 && dropBefore !== 'end' && (
          <li className="empty">{query ? 'No matching tasks' : 'Drop a task here'}</li>
        )}
      </ul>
    </section>
  )
}

// small wrapper so the drop line is rendered above the right card without touching TaskCard props
function TaskCardWithIndicator({ show, ...cardProps }) {
  return (
    <>
      {show && <li className="drop-line" aria-hidden="true" />}
      <TaskCard {...cardProps} />
    </>
  )
}

export default memo(Column)
