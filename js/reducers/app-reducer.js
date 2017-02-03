import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'
import {tracesList} from './traces-list'

const AppReducer = combineReducers({
  tracesList,
  routing: routerReducer
})

export default AppReducer
