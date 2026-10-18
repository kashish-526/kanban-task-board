import { memo, useState } from 'react'
import { useRenderCount } from '../hooks/useRenderCount.js'

const PRIORITY_LABEL = { high: 'High', medium: 'Medium', low: 'Low' }

function TaskCard({ task, columnId, prevColumnId, nextColumnId, onDelete, onEdit, onMove, showStats }) {
  const renders = useRenderCount(`TaskCard ${task.id}`)
  const [editing, setEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(task.title)
  const [draftDesc, setDraftDesc] = useState(task.description)

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id)
    e.dataTransfer.effectAllowed = 'move'
    // class is added straight on the DOM node so React does not need to re-render anything
    e.currentTarget.classList.add('dragging')
  }

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging')
  }

  const saveEdit = (e) => {
    e.preventDefault()
    const title = draftTitle.trim()
    if (!title) return
    onEdit(task.id, { title, description: draftDesc.trim() })
    setEditing(false)
  }

  const cancelEdit = () => {
    setDraftTitle(task.title)
    setDraftDesc(task.description)
    setEditing(false)
  }

  if (editing) {
    return (
      <li className="card editing" data-task-id={task.id}>
        <form onSubmit={saveEdit}>
          <input
            className="input"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            aria-label="Task title"
            autoFocus
          />
          <textarea
            className="input"
            rows={2}
            value={draftDesc}
            onChange={(e) => setDraftDesc(e.target.value)}
            aria-label="Task description"
          />
          <div className="card-actions">
            <button type="submit" className="btn btn-small btn-primary">Save</button>
            <button type="button" className="btn btn-small" onClick={cancelEdit}>Cancel</button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li
      className={`card priority-${task.priority}`}
      draggable
      data-task-id={task.id}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="card-top">
        <span className={`badge badge-${task.priority}`}>{PRIORITY_LABEL[task.priority]}</span>
        {showStats && <span className="render-badge" title="times this card rendered">r:{renders}</span>}
      </div>
      <h3 className="card-title">{task.title}</h3>
      {task.description && <p className="card-desc">{task.description}</p>}

      <div className="card-actions">
        {/* arrow buttons = fallback for touch screens / keyboard where HTML5 drag does not work */}
        <button
          className="btn btn-small"
          disabled={!prevColumnId}
          onClick={() => onMove(task.id, prevColumnId)}
          aria-label={`Move ${task.title} left`}
        >
          ◀
        </button>
        <button
          className="btn btn-small"
          disabled={!nextColumnId}
          onClick={() => onMove(task.id, nextColumnId)}
          aria-label={`Move ${task.title} right`}
        >
          ▶
        </button>
        <span className="spacer" />
        <button className="btn btn-small" onClick={() => setEditing(true)} aria-label={`Edit ${task.title}`}>Edit</button>
        <button className="btn btn-small btn-danger" onClick={() => onDelete(task.id)} aria-label={`Delete ${task.title}`}>✕</button>
      </div>
    </li>
  )
}

// memo = card re-renders only when its own props change
export default memo(TaskCard)
