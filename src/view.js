// @flow
import { compose } from '@most/prelude'
import { bind, wire } from 'hyperhtml'
import { type App, type Filter, type Todo, completedCount } from './model'
import { type Action, handleAdd, handleToggleAll, handleComplete, handleRemove, handleRemoveAllCompleted } from './action'

const maybeClass = (className: string) => (condition: bool): string =>
  condition ? className : ''

const ifCompleted = maybeClass('completed')
const ifSelected = maybeClass('selected')

export const updateView = (addAction: Action => void) => (appNode: Element, appState: App): Element => {
  const count = completedCount(appState)
  const todos = appState.todos.filter(t => {
    switch (appState.filter) {
      case '/': return true
      case '/active': return t.completed
      case '/completed': return !t.completed
    }
  })

  return bind(appNode)`
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" name="new-todo" placeholder="What needs to be done?" autofocus onkeypress="${compose(addAction, handleAdd)}">
    </header>
    ${renderTodoList(addAction, todos.length > 0 && count === todos.length, todos)}
    ${renderFooter(addAction, appState.todos.length - count, count, appState)}`
}

export const renderTodoList = (addAction: Action => void, allCompleted: boolean, todos: Todo[]): Element =>
  wire()`<section class="main">
    <input id="toggle-all" class="toggle-all" type="checkbox" checked=${allCompleted} onchange=${compose(addAction, handleToggleAll)}>
    <label for="toggle-all">Mark all as complete</label>
    <ul class="todo-list">
      <!-- These are here just to show the structure of the list items -->
      <!-- List items should get the class editing when editing and completed when marked as completed -->
      ${todos.map(renderTodo(compose(addAction, handleComplete), compose(addAction, handleRemove)))}
    </ul>
  </section>`

export const renderTodo = (onComplete: Action => void, onRemove: Action => void) => ({ id, completed, description }: Todo): Element =>
  wire()`<li data-id="${id}" class="${ifCompleted(completed)}">
    <div class="view">
      <input class="toggle" type="checkbox" checked=${completed} onchange=${onComplete}>
      <label>${description}</label>
      <button class="destroy" onclick="${onRemove}"></button>
    </div>
    <input class="edit" value="${description}">
  </li>`

export const renderFooter = (addAction: Action => void, remainingCount: number, completedCount: number, { todos, filter }: App): Element =>
  wire()`<footer class="footer" style="${todos.length === 0 ? 'display:none' : ''}">
    <!-- This should be 0 items left by default -->
    <span class="todo-count"><strong>${remainingCount}</strong> ${remainingCount === 1 ? 'item' : 'items'} left</span>
    <!-- Remove this if you don't implement routing -->
    <ul class="filters">
      <li><a class="${ifSelected(filter === '/')}" href="#/">All</a><li>
      <li><a class="${ifSelected(filter === '/active')}" href="#/active">Active</a><li>
      <li><a class="${ifSelected(filter === '/completed')}" href="#/completed">Completed</a><li>
    </ul>
    <!-- Hidden if no completed items are left ↓ -->
    <button class="clear-completed" style="${completedCount > 0 ? '' : 'display:none'}" onclick="${compose(addAction, handleRemoveAllCompleted)}">Clear completed</button>
  </footer>`
