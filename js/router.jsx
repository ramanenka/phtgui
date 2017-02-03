import React from 'react'
import {Router, Route} from 'react-router'
import TracesList from './components/traces-list/traces-list'
import Trace from './components/Trace'
import {fetchTracesIfNeeded} from './actions/traces-list'

export default function createRouter(store, history) {
  return (
    <Router history={history}>
      <Route path="/" component={TracesList} onEnter={() => {
        store.dispatch(fetchTracesIfNeeded())
      }}/>
      <Route path="/traces/(:traceId)" component={Trace} />
    </Router>
  )
}
