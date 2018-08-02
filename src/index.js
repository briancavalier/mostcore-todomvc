// @flow
// TODO:
// 1. localStorage
// 2. todo editing
// 3. comments/walkthrough
/* global Document, Element */
import { skipRepeats, map, merge, scan, runEffects } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import { hashchange } from '@most/dom-event'

import { emptyApp } from './model'
import { updateView } from './view'
import { handleFilterChange, runAction } from './action'
import { createHyperEventAdapter } from './hyperEventAdapter'

const fail = (s: string): empty => { throw new Error(s) }
const qs = (s: string, el: Document): Element =>
  el.querySelector(s) || fail(`${s} not found`)

const appNode = qs('.todoapp', document)
const appState = emptyApp
const scheduler = newDefaultScheduler()

const [addAction, todoActions] = createHyperEventAdapter(scheduler)

const updateFilter = map(handleFilterChange, hashchange(window))

const actions = merge(todoActions, updateFilter)

const stateUpdates = skipRepeats(scan(runAction, appState, actions))
const viewUpdates = scan(updateView(addAction), appNode, stateUpdates)

runEffects(viewUpdates, scheduler)
