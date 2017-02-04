import React from 'react'
import {Router} from 'react-router'

import {createRouter as createListRouter} from './list/router'
import {createRouter as createTraceRouter} from './trace/router'
import {createRouter as createFlameRouter} from './flame/router'

export default function createRouter(store, history) {
  return (
    <Router history={history}>
      {createListRouter(store, history)}
      {createTraceRouter(store, history, [
        createFlameRouter(store, history)
      ])}
    </Router>
  )
}
