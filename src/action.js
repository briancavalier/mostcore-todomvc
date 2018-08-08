// @flow
/* global HTMLElement, HTMLInputElement, Event, $Call */
import { type Filter, type Todo } from './model'

type As<B, A = *> = $Call<A, A => B>

type DOMEvent<E> = { target: E } & Event
type InputEvent = DOMEvent<HTMLInputElement>
type ClickEvent = DOMEvent<HTMLElement>
type HashChangeEvent = { newURL: string } & Event

const ENTER_KEY = 'Enter'
// const ESC_KEY = 'Escape'

export type Add = { action: 'add', description: string }

export const handleAdd = (e: As<InputEvent>): ?Add => {
  const description = e.target.value.trim()
  if (e.key !== ENTER_KEY || description.length === 0) {
    return undefined
  }
  e.target.value = ''
  return { action: 'add', description }
}

export type ToggleAll = { action: 'toggleAll', completed: boolean }

export const handleToggleAll = (e: As<InputEvent>): ToggleAll =>
  ({ action: 'toggleAll', completed: e.target.checked })

export type Complete = { action: 'complete', todo: Todo, completed: boolean }

export const handleComplete = (todo: Todo) => (e: As<InputEvent>): Complete =>
  ({ action: 'complete', todo, completed: e.target.checked })

export type Remove = { action: 'remove', todo: Todo }

export const handleRemove = (todo: Todo) => (e: As<ClickEvent>): Remove =>
  ({ action: 'remove', todo })

export type RemoveAllCompleted = { action: 'removeAllCompleted' }

export const handleRemoveAllCompleted = (e: As<InputEvent>): RemoveAllCompleted =>
  ({ action: 'removeAllCompleted' })

export type FilterChange = { action: 'filterChange', filter: Filter }

export const handleFilterChange = (e: As<HashChangeEvent>): FilterChange =>
  ({ action: 'filterChange', filter: e.newURL.replace(/^.*#/, '') })
