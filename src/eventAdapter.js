// @flow
import type { Scheduler, Stream } from '@most/types'
import { MulticastSource, never } from '@most/core'

export const createEventAdapter = <A>(scheduler: Scheduler): ([A => void, Stream<A>]) => {
  const stream = new MulticastSource(never())
  return [action => stream.event(scheduler.currentTime(), action), stream]
}
