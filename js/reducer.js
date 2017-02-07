import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'
import {tracesList} from './list/reducers'
import {flame} from './flame/reducers'
import {trace} from './trace/reducers'

const AppReducer = combineReducers({
  tracesList,
  trace,
  flame,
  routing: routerReducer
})

export default AppReducer
