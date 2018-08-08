// @flow
import type { Add, Complete, FilterChange, Input, Remove, RemoveAllCompleted, ToggleAll } from './action'
import { type App, addTodo, setFilter, removeTodo, removeAllCompleted, updateAllCompleted, updateCompleted, updateInput } from './model'

// The types that this interpreter can interpret
// TODO: modularize interpreters so we don't have
// to define a monolithic interpreter.  It should be
// possible to define interpreters over subsets of
// these actions (even over a single action), and
// compose them.
type Action =
  | Add
  | Complete
  | FilterChange
  | Input
  | Remove
  | RemoveAllCompleted
  | ToggleAll

export const interpretTodos = (app: App, action: Action): App => {
  switch (action.action) {
    case 'input': return updateInput(action.input, app)
    case 'add': return addTodo(action.description, app)
    case 'complete': return updateCompleted(action.completed, action.todo, app)
    case 'filterChange': return setFilter(action.filter, app)
    case 'remove': return removeTodo(action.todo, app)
    case 'removeAllCompleted': return removeAllCompleted(app)
    case 'toggleAll': return updateAllCompleted(action.completed, app)
  }

  return app
}
