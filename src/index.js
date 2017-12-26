// @flow
import type { Stream } from '@most/types'
import { tap, filter, map, mergeArray, scan, runEffects } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import { id, compose } from '@most/prelude'
import { submit, hashchange } from '@most/dom-event'
import { bind } from 'hyperhtml'

import { emptyApp, addTodo, setFilter, runAction } from './model'
import { updateView } from './view'

type HashChangeEvent = { newURL: string } & Event
type DOMEvent<E> = { target: E } & Event
type SubmitEvent = DOMEvent<HTMLFormElement>

type As<B, A = *> = $Call<A, A => B>

const fail = (s) => { throw new Error(s) }
const qs = (s, el) => el.querySelector(s) || fail(`${s} not found`)

const isKey = (keyCode: number) => filter(e => e.keyCode === keyCode)
const match = (query: string) => filter(e => e.target.matches(query))
const resetForm = tap(e => e.target.reset())
const preventDefault = tap(e => e.preventDefault())

const ENTER_KEY = 13
const ESC_KEY = 27

const appNode = qs('.todoapp', document)
const appState = emptyApp

const handleSubmit = ({ target }: As<SubmitEvent>) => {
  const value: As<string> = target['new-todo'].value
  if (!value) {
    return id
  }

  target.reset()
  return addTodo(value)
}

const add = map(handleSubmit, preventDefault(submit(appNode)))
const updateFilter = map((e: As<HashChangeEvent>) => setFilter(e.newURL.replace(/^.*#/, '')), hashchange(window))

const actions = mergeArray([add, updateFilter])

const stateUpdates = scan(runAction, appState, actions)
const viewUpdates = scan(updateView, appNode, stateUpdates)

runEffects(viewUpdates, newDefaultScheduler())
