import React from 'react'
import {Router, Route} from 'react-router'
import TracesList from './components/traces-list/traces-list'
import Trace from './components/Trace'

export default function createRouter(history) {
  return (
    <Router history={history}>
      <Route path="/" component={TracesList} />
      <Route path="/traces/(:traceId)" component={Trace} />
    </Router>
  )
}
