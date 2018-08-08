// @flow
import type { Add, ToggleAll } from './action'
import { type App, addTodo, updateAllCompleted } from './model'

type Action = Add | ToggleAll

export const interpretTodos = (app: App, action: Action): App => {
  switch(action.action) {
    case 'add': return addTodo(action.description, app)
    case 'toggleAll': return updateAllCompleted(action.completed, app)
  }

  return app
}
