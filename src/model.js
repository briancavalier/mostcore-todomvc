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
  todos: Todo[],
  focus: ?Id,
  filter: Filter,
  nextId: Id
}

export const emptyApp: App =
  { todos: [], focus: null, filter: '/', nextId: 0 }

export const completedCount = ({ todos }: App): number =>
  todos.reduce(countIfCompleted, 0)

const countIfCompleted = (count, { completed }) =>
  count + (completed ? 1 : 0)

export const addTodo = (description: string) => (app: App): App =>
  ({
    ...app,
    nextId: app.nextId + 1,
    todos: app.todos.concat([newTodo(description, app.nextId)])
  })

export const removeTodo = (id: Id) => (app: App): App =>
  ({
    ...app,
    todos: app.todos.filter(todo => todo.id !== id)
  })

export const updateCompleted = (completed: boolean, id: Id) => (app: App): App =>
  ({
    ...app,
    todos: app.todos.map(todo => todo.id === id ? { ...todo, completed } : todo)
  })

export const updateAllCompleted = (completed: boolean) => (app: App): App =>
  ({
    ...app,
    todos: app.todos.map(todo => ({ ...todo, completed }))
  })

export const removeAllCompleted = (app: App): App =>
  ({
    ...app,
    todos: app.todos.filter(todo => !todo.completed)
  })

export const setFilter = (filter: Filter) => (app: App): App =>
  ({
    ...app,
    filter
  })

// export const setFocus = (focus: ?Id) => (app: App): App =>
//   ({
//     ...app,
//     focus
//   })
//
// export const updateDescription = (description: string, id: Id) => (app: App): App =>
//   ({
//     ...app,
//     todos: app.todos.map(todo => todo.id === id ? { ...todo, description } : todo)
//   })
