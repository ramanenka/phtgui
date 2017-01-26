import React from 'react'
import {render} from 'react-dom'
import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import {Provider} from 'react-redux'
import {Router, Route, hashHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import TracesList from './components/traces-list/traces-list'
import Trace from './Trace'
import AppReducer from './reducers/index'
import {fetchTraces} from './actions'

let store = createStore(
  AppReducer,
  applyMiddleware(
    thunkMiddleware,
    createLogger()
  )
)
const history = syncHistoryWithStore(hashHistory, store)

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={TracesList} />
      <Route path="/traces/(:traceId)" component={Trace} />
    </Router>
  </Provider>,
  document.getElementById('root')
)
