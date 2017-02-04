import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'
import {tracesList} from './list/reducers'
import {flame} from './flame/reducers'

const trace = combineReducers({
  flame
})

const AppReducer = combineReducers({
  tracesList,
  trace,
  routing: routerReducer
})

export default AppReducer
