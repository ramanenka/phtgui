import React from 'react'
import {Router, Route, IndexRoute} from 'react-router'
import TracesList from './components/traces-list/traces-list'
import {fetchTracesIfNeeded} from './actions/traces-list'

import Trace from './components/trace/trace'
import TraceNav from './components/trace/nav'
import Flame from './components/trace/flame'
import {fetchFlameTree} from './actions/trace/flame'

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
