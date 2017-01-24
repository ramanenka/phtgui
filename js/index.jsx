import React from 'react'
import {render} from 'react-dom'
import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import {Provider} from 'react-redux'
import {Router, Route, hashHistory} from 'react-router'
import FilterableTracesListConnected from './FilterableTracesList.jsx'
import Trace from './Trace.jsx'
import AppReducer from './reducers/index.js'
import {fetchTraces} from './actions.js'

let store = createStore(
  AppReducer,
  applyMiddleware(
    thunkMiddleware,
    createLogger()
  )
)

store.dispatch(fetchTraces())

render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={FilterableTracesListConnected} />
      <Route path="/traces/(:traceId)" component={Trace} />
    </Router>
  </Provider>,
  document.getElementById('root')
)
