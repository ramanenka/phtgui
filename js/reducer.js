import {combineReducers} from 'redux'
import {tracesList} from 'list/reducers'
import {flame} from 'flame/reducers'
import {trace} from 'trace/reducers'

const AppReducer = combineReducers({
  tracesList,
  trace,
  flame
})

export default AppReducer
