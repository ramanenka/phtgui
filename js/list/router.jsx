import React from 'react'
import {Route} from 'react-router'
import TracesList from './components/traces-list'
import {fetchTracesIfNeeded} from './actions'

export function createRouter(store, history, children = []) {
  let onEnter = () => {
    store.dispatch(fetchTracesIfNeeded())
  }

  return (
    <Route path="/" component={TracesList} onEnter={onEnter}>
      {children}
    </Route>
  )
}
