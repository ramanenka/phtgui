import {combineReducers} from 'redux'
import {TRACES_REQUEST, TRACES_RECEIVE} from '../actions'

function tracesList(state = {isFetching: false, traces: []}, action) {
  switch(action.type) {
    case TRACES_REQUEST:
      return Object.assign({}, state, {isFetching: true})
    case TRACES_RECEIVE:
      return Object.assign({}, state, {isFetching: false, traces: action.json})
    default:
      return state
  }
}

const AppReducer = combineReducers({
  tracesList
})

export default AppReducer
