import React from 'react'
import {render} from 'react-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {Router, Route, hashHistory} from 'react-router'
import FilterableTracesList from './FilterableTracesList.jsx'
import AppReducer from './reducers/index.js'
import {TracesDataList} from './traces.data.js'

let store = createStore(AppReducer)

render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={FilterableTracesList} traces={TracesDataList}/>
    </Router>
  </Provider>,
  document.getElementById('root')
)
