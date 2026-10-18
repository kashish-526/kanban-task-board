export const COLUMN_ORDER = ['todo', 'inprogress', 'done']

export const initialState = {
  columns: {
    todo: {
      id: 'todo',
      title: 'To Do',
      tasks: [
        { id: 't1', title: 'Set up project with Vite', description: 'Create the React app and clean the boilerplate', priority: 'high' },
        { id: 't2', title: 'Design component tree', description: 'Board > Column > TaskCard', priority: 'medium' },
        { id: 't3', title: 'Write README', description: 'Setup steps and screenshots', priority: 'low' },
      ],
    },
    inprogress: {
      id: 'inprogress',
      title: 'In Progress',
      tasks: [
        { id: 't4', title: 'Add drag and drop', description: 'Use the HTML5 drag events', priority: 'high' },
      ],
    },
    done: {
      id: 'done',
      title: 'Done',
      tasks: [
        { id: 't5', title: 'Finish Sprint 4 JavaScript logic', description: 'Old vanilla JS version of the board', priority: 'medium' },
      ],
    },
  },
}
