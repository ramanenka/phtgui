import React from 'react'
import {Route, IndexRoute} from 'react-router'
import Trace from './components/trace'
import TraceNav from './components/nav'
import {openTrace, closeTrace, fetchTrace} from './actions'

export function createRouter(store, history, children = []) {
  let onEnter = nextState => {
    store.dispatch(openTrace(nextState.params.traceId))
    store.dispatch(fetchTrace())
  }

  let onLeave = () => {
    store.dispatch(closeTrace())
  }

  return (
    <Route path="/traces/:traceId" component={TraceNav} onEnter={onEnter} onLeave={onLeave}>
      <IndexRoute component={Trace} />
      {children}
    </Route>
  )
}
