import { memo, useState } from 'react'

function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd('todo', title.trim(), description.trim(), priority)
    setTitle('')
    setDescription('')
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        className="input"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Task title"
        maxLength={80}
      />
      <input
        className="input"
        placeholder="Short description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        aria-label="Task description"
        maxLength={140}
      />
      <select className="input" value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Priority">
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <button type="submit" className="btn btn-primary" disabled={!title.trim()}>
        Add task
      </button>
    </form>
  )
}

export default memo(AddTaskForm)
