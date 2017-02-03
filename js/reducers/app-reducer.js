import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'
import {tracesList} from './traces-list'
import {trace} from './trace'

const AppReducer = combineReducers({
  tracesList,
  trace,
  routing: routerReducer
})

export default AppReducer
