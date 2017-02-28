import React from 'react'
import {Route} from 'react-router'
import FlameContainer from './components/flame-container'
import {fetchFlameTreeObserver} from './observers'
import {openFlame, closeFlame} from './actions'

export function createRouter(store, history, children = []) {
  let unsubscribe

  let onEnter = () => {
    store.dispatch(openFlame())
    unsubscribe = fetchFlameTreeObserver(store)
  }

  let onLeave = () => {
    unsubscribe()
    store.dispatch(closeFlame())
  }

  return (
    <Route key="flame"
      path="/traces/:traceId/flame"
      component={FlameContainer}
      onEnter={onEnter}
      onLeave={onLeave}>
      {children}
    </Route>
  )
}
