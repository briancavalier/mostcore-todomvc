// @flow
import { compose } from '@most/prelude'
import * as React from 'react'
import { type App, type Filter, type Todo, completedCount } from './model'
import { type Action, handleAdd, handleToggleAll, handleComplete, handleRemove, handleRemoveAllCompleted } from './action'

const maybeClass = (className: string) => (condition: bool): string =>
  condition ? className : ''
const ifCompleted = maybeClass('completed')
const ifSelected = maybeClass('selected')

const filterTodos = ({ filter, todos }: App): Todo[] =>
  todos.filter(t => {
    switch (filter) {
      case '/': return true
      case '/active': return !t.completed
      case '/completed': return t.completed
    }
  })

export const View = (addAction: Action => void) => (appState: App): React.Element<*> => {
  const completed = completedCount(appState)
  const todos = appState.todos
  const filtered = filterTodos(appState)
  const remaining = todos.length - completed

  return <div>
    <header className='header'>
      <h1>todos</h1>
      <input className='new-todo' name='new-todo' placeholder='What needs to be done?' autoComplete='off' autoFocus onKeyPress={compose(addAction, handleAdd)} />
    </header>
    <TodoList addAction={addAction} allCompleted={todos.length > 0 && remaining === 0} todos={filtered} />
    {todos.length > 0 && <Footer addAction={addAction} remaining={remaining} completed={completed} filter={appState.filter} />}</div>
}

type TodoListProps = {
  addAction: Action => void,
  allCompleted: boolean,
  todos: Todo[]
}

export const TodoList = ({ addAction, allCompleted, todos }: TodoListProps): React.Element<*> =>
  <section className='main'>
    <input id='toggle-all' className='toggle-all' type='checkbox' checked={allCompleted} onChange={compose(addAction, handleToggleAll)} />
    <label htmlFor='toggle-all'>Mark all as complete</label>
    <ul className='todo-list'>
      {todos.map(todo =>
        <TodoItem key={todo.id}
          addAction={addAction}
          todo={todo} />
      )}
    </ul>
  </section>

type TodoProps = {
  addAction: Action => void,
  todo: Todo
}

export const TodoItem = ({ addAction, todo: { id, completed, description } }: TodoProps): React.Element<*> =>
  <li className={ifCompleted(completed)}>
    <div className='view'>
      <input className='toggle' type='checkbox' checked={completed} onChange={compose(addAction, handleComplete(id))} />
      <label>{description}</label>
      <button className='destroy' onClick={compose(addAction, handleRemove(id))} />
    </div>
    <input className='edit' value={description} />
  </li>

type FooterProps = {
  addAction: Action => void,
  remaining: number,
  completed: number,
  filter: Filter
}

export const Footer = ({ addAction, remaining, completed, filter }: FooterProps): React.Element<*> =>
  <footer className='footer'>
    <span className='todo-count'><strong>{remaining}</strong> {remaining === 1 ? 'item' : 'items'} left</span>
    <ul className='filters'>
      <li><a className={ifSelected(filter === '/')} href='#/'>All</a></li>
      <li><a className={ifSelected(filter === '/active')} href='#/active'>Active</a></li>
      <li><a className={ifSelected(filter === '/completed')} href='#/completed'>Completed</a></li>
    </ul>
    {completed > 0 && <button className='clear-completed' onClick={compose(addAction, handleRemoveAllCompleted)}>Clear completed</button>}
  </footer>
