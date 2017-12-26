// @flow
// TODO:
// 1. Add AppStateWithCompletedCount type and derive it from AppState
//    via action stream
// 2. Use CSS to show/hide
// 3. localStorage
// 4. Comments/walkthrough
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
