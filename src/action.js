// @flow
/* global HTMLElement, HTMLInputElement, Event, $Call */
import { id } from "@most/prelude"
import {
  type App,
  type Todo,
  addTodo,
  updateCompleted,
  removeTodo,
  updateAllCompleted,
  removeAllCompleted,
  setFilter
} from "./model"

type As<B, A = *> = $Call<A, (A) => B>

type DOMEvent<E> = { target: E } & Event
type InputEvent = DOMEvent<HTMLInputElement>
type ClickEvent = DOMEvent<HTMLElement>
type HashChangeEvent = { newURL: string } & Event

const ENTER_KEY = "Enter"
// const ESC_KEY = 'Escape'

export type Action = (App) => App

export const runAction = (app: App, action: Action): App => action(app)

export const handleAdd = (e: As<InputEvent>): Action => {
  const value = e.target.value.trim()
  if (e.key !== ENTER_KEY || value.length === 0) {
    return id
  }
  e.target.value = ""
  return addTodo(value)
}

export const handleToggleAll = (e: As<InputEvent>): Action => updateAllCompleted(e.target.checked)

export const handleComplete =
  ({ id }: Todo) =>
  (e: As<InputEvent>): Action =>
    updateCompleted(e.target.checked, id)

export const handleRemove =
  ({ id }: Todo) =>
  (e: As<ClickEvent>): Action =>
    removeTodo(id)

export const handleRemoveAllCompleted = (e: As<InputEvent>): Action => removeAllCompleted

export const handleFilterChange = (e: As<HashChangeEvent>): Action =>
  setFilter(e.newURL.replace(/^.*#/, ""))
