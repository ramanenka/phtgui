import React from 'react'
import {render} from 'react-dom'
import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import {Provider} from 'react-redux'
import {hashHistory} from 'react-router'
import AppReducer from 'reducer'
import createRouter from 'router'

let store = createStore(
  AppReducer,
  applyMiddleware(
    thunkMiddleware,
    createLogger({collapsed: true})
  )
)

render(
  <Provider store={store}>
    {createRouter(store, hashHistory)}
  </Provider>,
  document.getElementById('root')
)
