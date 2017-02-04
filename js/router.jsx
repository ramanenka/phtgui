import React from 'react'
import {Router, Route, IndexRoute} from 'react-router'
import TracesList from './list/components/traces-list'
import {fetchTracesIfNeeded} from './list/actions'

import Trace from './trace/components/trace'
import TraceNav from './trace/components/nav'
import Flame from './flame/components/flame'
import {fetchFlameTree} from './flame/actions'

export default function createRouter(store, history) {
  return (
    <Router history={history}>
      <Route path="/" component={TracesList} onEnter={() => {
        store.dispatch(fetchTracesIfNeeded())
      }}/>
      <Route path="/traces/:traceId" component={TraceNav}>
        <IndexRoute component={Trace} />
        <Route path="/traces/:traceId/flame" component={Flame} onEnter={() => {
          store.dispatch(fetchFlameTree())
        }} />
      </Route>
    </Router>
  )
}
