import React from 'react'
import {Route, IndexRoute} from 'react-router'
import Trace from './components/trace'
import TraceNav from './components/nav'

export function createRouter(store, history, children = []) {
  return (
    <Route path="/traces/:traceId" component={TraceNav}>
      <IndexRoute component={Trace} />
      {children}
    </Route>
  )
}
