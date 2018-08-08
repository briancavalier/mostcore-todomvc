// @flow
import type { Add, Complete, FilterChange, Input, Remove, RemoveAllCompleted, ToggleAll } from './action'
import { type App, addTodo, setFilter, removeTodo, removeAllCompleted, updateAllCompleted, updateCompleted, updateInput } from './model'
import { type Either } from 'most-product'

// The types that this interpreter can interpret
// TODO: modularize interpreters so we don't have
// to define a monolithic interpreter.  It should be
// possible to define interpreters over subsets of
// these actions (even over a single action), and
// compose them.
type TodoAction =
  | Add
  | Input
  | Complete
  | Remove
  | RemoveAllCompleted
  | ToggleAll

export const interpretTodos = (app: App, action: TodoAction): App => {
  switch (action.action) {
    case 'input': return updateInput(action.input, app)
    case 'add': return addTodo(action.description, app)
    case 'complete': return updateCompleted(action.completed, action.todo, app)
    case 'remove': return removeTodo(action.todo, app)
    case 'removeAllCompleted': return removeAllCompleted(app)
    case 'toggleAll': return updateAllCompleted(action.completed, app)
    default: return app
  }
}

export const interpretFilterChange = (app: App, action: FilterChange): App =>
  setFilter(action.filter, app)

export type Interpreter<S, A> = (S, A) => S
export const composeInterpreters = <S, A, B> (ia: Interpreter<S, A>, ib: Interpreter<S, B>): Interpreter<S, Either<A, B>> =>
  (s: S, eab: Either<A, B>): S =>
    eab.right ? ib(s, eab.value) : ia(s, eab.value)
