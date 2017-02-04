import React from 'react'
import {Route} from 'react-router'
import Flame from './components/flame'
import {fetchFlameTree} from './actions'

export function createRouter(store, history, children = []) {
  let onEnter = () => {
    store.dispatch(fetchFlameTree())
  }

  return (
    <Route key="flame" path="/traces/:traceId/flame" component={Flame} onEnter={onEnter}>
      {children}
    </Route>
  )
}
