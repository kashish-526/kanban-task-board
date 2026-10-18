import { Profiler, useCallback, useReducer } from 'react'
import Board from './components/Board.jsx'
import AddTaskForm from './components/AddTaskForm.jsx'
import RenderStats from './components/RenderStats.jsx'
import { useBoard } from './hooks/useBoard.js'
import { renderStats } from './renderStats.js'

// small reducer for the screen settings (search text + stats panel)
function uiReducer(state, action) {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.value }
    case 'TOGGLE_STATS':
      return { ...state, showStats: !state.showStats }
    default:
      return state
  }
}

function onProfilerRender(id, phase, actualDuration) {
  renderStats.recordCommit({ id, phase, actualDuration })
}

export default function App() {
  // App is the common ancestor: board state lives here and goes down as props
  const { state, addTask, deleteTask, editTask, moveTask, clearDone, resetBoard } = useBoard()
  const [ui, dispatchUi] = useReducer(uiReducer, { query: '', showStats: false })

  const handleQuery = useCallback((e) => dispatchUi({ type: 'SET_QUERY', value: e.target.value }), [])
  const toggleStats = useCallback(() => dispatchUi({ type: 'TOGGLE_STATS' }), [])

  const todoCount = state.columns.todo.tasks.length
  const progressCount = state.columns.inprogress.tasks.length
  const doneCount = state.columns.done.tasks.length
  const total = todoCount + progressCount + doneCount
  const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100)

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-top">
          <div>
            <h1>Kanban Task Board</h1>
            <p className="subtitle">Plan your work, drag cards across columns and track progress.</p>
          </div>
          <div className="hero-tools">
            <input
              className="input search"
              type="search"
              placeholder="Search tasks..."
              value={ui.query}
              onChange={handleQuery}
              aria-label="Search tasks"
            />
            <button className="btn btn-glass" onClick={toggleStats} aria-pressed={ui.showStats}>
              {ui.showStats ? 'Hide stats' : 'Show stats'}
            </button>
            <button className="btn btn-glass" onClick={resetBoard}>Reset board</button>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat"><b>{total}</b><span>Total tasks</span></div>
          <div className="stat"><b>{todoCount}</b><span>To do</span></div>
          <div className="stat"><b>{progressCount}</b><span>In progress</span></div>
          <div className="stat"><b>{doneCount}</b><span>Completed</span></div>
          <div className="progress" aria-label={`${percent}% completed`}>
            <div className="progress-bar" style={{ width: `${percent}%` }} />
            <span className="progress-text">{percent}% done</span>
          </div>
        </div>
      </header>

      <AddTaskForm onAdd={addTask} />

      {ui.showStats && <RenderStats />}

      <Profiler id="Board" onRender={onProfilerRender}>
        <Board
          columns={state.columns}
          query={ui.query}
          showStats={ui.showStats}
          onDelete={deleteTask}
          onEdit={editTask}
          onMove={moveTask}
          onClearDone={clearDone}
        />
      </Profiler>
    </div>
  )
}
