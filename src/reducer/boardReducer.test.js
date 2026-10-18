import test from 'node:test'
import assert from 'node:assert/strict'
import { boardReducer, ACTIONS } from './boardReducer.js'
import { initialState } from './initialData.js'

test('ADD_TASK adds a task at the end of the column', () => {
  const task = { id: 'x1', title: 'New', description: '', priority: 'low' }
  const next = boardReducer(initialState, { type: ACTIONS.ADD_TASK, payload: { columnId: 'todo', task } })
  assert.equal(next.columns.todo.tasks.at(-1).id, 'x1')
  assert.equal(next.columns.todo.tasks.length, initialState.columns.todo.tasks.length + 1)
})

test('MOVE_TASK moves a card from To Do to In Progress', () => {
  const next = boardReducer(initialState, {
    type: ACTIONS.MOVE_TASK,
    payload: { taskId: 't1', toColumnId: 'inprogress', beforeId: null },
  })
  assert.ok(!next.columns.todo.tasks.some((t) => t.id === 't1'))
  assert.equal(next.columns.inprogress.tasks.at(-1).id, 't1')
})

test('MOVE_TASK keeps untouched columns on the same reference', () => {
  const next = boardReducer(initialState, {
    type: ACTIONS.MOVE_TASK,
    payload: { taskId: 't1', toColumnId: 'inprogress', beforeId: null },
  })
  assert.equal(next.columns.done, initialState.columns.done)
})

test('MOVE_TASK can reorder inside the same column', () => {
  const next = boardReducer(initialState, {
    type: ACTIONS.MOVE_TASK,
    payload: { taskId: 't3', toColumnId: 'todo', beforeId: 't1' },
  })
  assert.deepEqual(next.columns.todo.tasks.map((t) => t.id), ['t3', 't1', 't2'])
})

test('MOVE_TASK dropped on the same spot returns the same state', () => {
  const next = boardReducer(initialState, {
    type: ACTIONS.MOVE_TASK,
    payload: { taskId: 't3', toColumnId: 'todo', beforeId: null },
  })
  assert.equal(next, initialState)
})

test('EDIT_TASK only changes the edited card', () => {
  const next = boardReducer(initialState, {
    type: ACTIONS.EDIT_TASK,
    payload: { taskId: 't2', changes: { title: 'Renamed' } },
  })
  assert.equal(next.columns.todo.tasks[1].title, 'Renamed')
  assert.equal(next.columns.todo.tasks[0], initialState.columns.todo.tasks[0])
})

test('DELETE_TASK removes the card', () => {
  const next = boardReducer(initialState, { type: ACTIONS.DELETE_TASK, payload: { taskId: 't4' } })
  assert.equal(next.columns.inprogress.tasks.length, 0)
})

test('CLEAR_DONE empties the Done column', () => {
  const next = boardReducer(initialState, { type: ACTIONS.CLEAR_DONE })
  assert.equal(next.columns.done.tasks.length, 0)
})
