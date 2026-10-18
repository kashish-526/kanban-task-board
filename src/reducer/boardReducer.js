import { COLUMN_ORDER, initialState } from './initialData.js'

export const ACTIONS = {
  ADD_TASK: 'ADD_TASK',
  EDIT_TASK: 'EDIT_TASK',
  DELETE_TASK: 'DELETE_TASK',
  MOVE_TASK: 'MOVE_TASK',
  CLEAR_DONE: 'CLEAR_DONE',
  RESET_BOARD: 'RESET_BOARD',
}

// finds column currently holds a task
function findColumnId(columns, taskId) {
  return COLUMN_ORDER.find((colId) => columns[colId].tasks.some((t) => t.id === taskId))
}

export function boardReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_TASK: {
      const { columnId, task } = action.payload
      const column = state.columns[columnId]
      if (!column) return state
      return {
        ...state,
        columns: {
          ...state.columns,
          [columnId]: { ...column, tasks: [...column.tasks, task] },
        },
      }
    }

    case ACTIONS.EDIT_TASK: {
      const { taskId, changes } = action.payload
      const colId = findColumnId(state.columns, taskId)
      if (!colId) return state
      const column = state.columns[colId]
      return {
        ...state,
        columns: {
          ...state.columns,
          [colId]: {
            ...column,
            tasks: column.tasks.map((t) => (t.id === taskId ? { ...t, ...changes } : t)),
          },
        },
      }
    }

    case ACTIONS.DELETE_TASK: {
      const { taskId } = action.payload
      const colId = findColumnId(state.columns, taskId)
      if (!colId) return state
      const column = state.columns[colId]
      return {
        ...state,
        columns: {
          ...state.columns,
          [colId]: { ...column, tasks: column.tasks.filter((t) => t.id !== taskId) },
        },
      }
    }

    case ACTIONS.MOVE_TASK: {
      // beforeId = id of the card the dragged card should be placed above (null = end of column)
      const { taskId, toColumnId, beforeId } = action.payload
      const fromId = findColumnId(state.columns, taskId)
      const toColumn = state.columns[toColumnId]
      if (!fromId || !toColumn || beforeId === taskId) return state

      const task = state.columns[fromId].tasks.find((t) => t.id === taskId)
      const fromTasks = state.columns[fromId].tasks.filter((t) => t.id !== taskId)
      const baseTasks = fromId === toColumnId ? fromTasks : toColumn.tasks

      let index = baseTasks.findIndex((t) => t.id === beforeId)
      if (index === -1) index = baseTasks.length
      const toTasks = [...baseTasks.slice(0, index), task, ...baseTasks.slice(index)]

      // dropped at the same spot - nothing changed, keep the old state so nothing re-renders
      if (fromId === toColumnId) {
        const same = toTasks.every((t, i) => t === state.columns[fromId].tasks[i])
        if (same) return state
      }

      return {
        ...state,
        columns: {
          ...state.columns,
          [fromId]: { ...state.columns[fromId], tasks: fromTasks },
          [toColumnId]: { ...toColumn, tasks: toTasks },
        },
      }
    }

    case ACTIONS.CLEAR_DONE: {
      if (state.columns.done.tasks.length === 0) return state
      return {
        ...state,
        columns: { ...state.columns, done: { ...state.columns.done, tasks: [] } },
      }
    }

    case ACTIONS.RESET_BOARD:
      return initialState

    default:
      return state
  }
}
