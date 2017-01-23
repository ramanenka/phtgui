import React from 'react'
import {render} from 'react-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import FilterableTracesList from './FilterableTracesList.jsx'
import AppReducer from './reducers'

let store = createStore(AppReducer)

render(
  <Provider store={store}>
    <FilterableTracesList />
  </Provider>,
  document.getElementById('root')
)
