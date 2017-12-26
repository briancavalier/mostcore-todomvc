// @flow
import { bind, wire } from 'hyperhtml'
import { type App, type Filter, type Todo, completedCount } from './model'

const maybeClass = (className: string) => (condition: bool): string =>
  condition ? className : ''

const ifCompleted = maybeClass('completed')
const ifSelected = maybeClass('selected')

export const updateView = (appNode: Element, appState: App): Element =>
  bind(appNode)`${renderApp(appState)}`

export const renderApp = (appState: App): Element => {
  const count = completedCount(appState.todos)
  return wire()
    `${renderHeader(appState)}
    ${renderTodoList(appState.todos.length > 0 && count === appState.todos.length, appState.todos)}
    ${renderFooter(appState.todos.length - count, count, appState)}`
}

export const renderHeader = (appState: App): Element => wire()
  `<header class="header">
    <h1>todos</h1>
    <form class="add-todo">
      <input class="new-todo" name="new-todo" placeholder="What needs to be done?" autofocus>
    </form>
  </header>`

export const renderTodoList = (allCompleted: boolean, todos: Todo[]): Element => wire()
  `<section class="main">
    <input id="toggle-all" class="toggle-all" type="checkbox" checked=${allCompleted}>
    <label for="toggle-all">Mark all as complete</label>
    <ul class="todo-list">
      <!-- These are here just to show the structure of the list items -->
      <!-- List items should get the class editing when editing and completed when marked as completed -->
      ${todos.map(renderTodo)}
    </ul>
  </section>`

export const renderTodo = ({ completed, description }: Todo): Element => wire()
  `<li class="${ifCompleted(completed)}">
    <div class="view">
      <input class="toggle" type="checkbox" checked=${completed}>
      <label>${description}</label>
      <button class="destroy"></button>
    </div>
    <input class="edit" value="${description}">
  </li>`

export const renderFooter = (remainingCount: number, completedCount: number, { todos, filter }: App): Element => wire()
  `<footer class="footer" style="${todos.length === 0 ? 'display:none' : ''}">
    <!-- This should be 0 items left by default -->
    <span class="todo-count"><strong>${todos.length}</strong> ${remainingCount === 1 ? 'item' : 'items'} left</span>
    <!-- Remove this if you don't implement routing -->
    <ul class="filters">
      <li><a class="${ifSelected('/' === filter)}" href="#/">All</a><li>
      <li><a class="${ifSelected('/active' === filter)}" href="#/active">Active</a><li>
      <li><a class="${ifSelected('/selected' === filter)}" href="#/completed">Completed</a><li>
    </ul>
    <!-- Hidden if no completed items are left ↓ -->
    <button class="clear-completed" style="${completedCount > 0 ? '' : 'display:none'}">Clear completed</button>
  </footer>`
