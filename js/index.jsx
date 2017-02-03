import React from 'react'
import {render} from 'react-dom'
import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import {Provider} from 'react-redux'
import {hashHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import AppReducer from './reducers/app-reducer'
import createRouter from './router'

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
    {createRouter(store, history)}
  </Provider>,
  document.getElementById('root')
)
