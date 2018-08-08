// @flow
export type Id = number

export type Todo = {
  description: string,
  completed: boolean,
  id: Id
}

export const newTodo = (description: string, id: number): Todo =>
  ({ description, completed: false, id })

export type Filter = '/' | '/active' | '/completed'

export type App = {
  input: string,
  todos: Todo[],
  filter: Filter,
  nextId: Id
}

export const emptyApp: App =
  { input: '', todos: [], filter: '/', nextId: 0 }

export const completedCount = (todos: Todo[]): number =>
  todos.reduce(countIfCompleted, 0)

const countIfCompleted = (count, { completed }) =>
  count + (completed ? 1 : 0)

export const addTodo = (description: string, app: App): App =>
  ({
    ...app,
    input: '',
    nextId: app.nextId + 1,
    todos: app.todos.concat([newTodo(description, app.nextId)])
  })

export const updateInput = (input: string, app: App): App =>
  ({ ...app, input })

export const removeTodo = (todo: Todo, app: App): App =>
  ({
    ...app,
    todos: app.todos.filter(t => t !== todo)
  })

export const updateCompleted = (completed: boolean, todo: Todo, app: App): App =>
  ({
    ...app,
    todos: app.todos.map(t => t === todo ? { ...t, completed } : t)
  })

export const updateAllCompleted = (completed: boolean, app: App): App =>
  ({
    ...app,
    todos: app.todos.map(todo => ({ ...todo, completed }))
  })

export const removeAllCompleted = (app: App): App =>
  ({
    ...app,
    todos: app.todos.filter(todo => !todo.completed)
  })

export const setFilter = (filter: Filter, app: App): App =>
  ({ ...app, filter })
