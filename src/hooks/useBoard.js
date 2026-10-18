import { useCallback, useEffect, useReducer } from 'react'
import { boardReducer, ACTIONS } from '../reducer/boardReducer.js'
import { COLUMN_ORDER, initialState } from '../reducer/initialData.js'

const STORAGE_KEY = 'kanban-board-v1'

// read saved board, fall back to the default data if anything looks wrong
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    const valid = saved && COLUMN_ORDER.every((id) => Array.isArray(saved.columns?.[id]?.tasks))
    return valid ? saved : initialState
  } catch {
    return initialState
  }
}

export function useBoard() {
  const [state, dispatch] = useReducer(boardReducer, undefined, loadState)

  // save to localStorage right after every state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // storage full or blocked - app still works, just not saved
    }
  }, [state])

  // dispatch never changes, so  callbacks are created only once
  const addTask = useCallback((columnId, title, description, priority) => {
    const task = { id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, title, description, priority }
    dispatch({ type: ACTIONS.ADD_TASK, payload: { columnId, task } })
  }, [])

  const deleteTask = useCallback((taskId) => {
    dispatch({ type: ACTIONS.DELETE_TASK, payload: { taskId } })
  }, [])

  const editTask = useCallback((taskId, changes) => {
    dispatch({ type: ACTIONS.EDIT_TASK, payload: { taskId, changes } })
  }, [])

  const moveTask = useCallback((taskId, toColumnId, beforeId = null) => {
    dispatch({ type: ACTIONS.MOVE_TASK, payload: { taskId, toColumnId, beforeId } })
  }, [])

  const clearDone = useCallback(() => dispatch({ type: ACTIONS.CLEAR_DONE }), [])
  const resetBoard = useCallback(() => dispatch({ type: ACTIONS.RESET_BOARD }), [])

  return { state, addTask, deleteTask, editTask, moveTask, clearDone, resetBoard }
}
