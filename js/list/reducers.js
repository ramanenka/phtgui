import {TRACES_REQUEST, TRACES_RECEIVE} from './actions'

export function tracesList(
  state = {isFetching: false, traces: [], isInvalidated: true},
  action
) {
  switch(action.type) {
    case TRACES_REQUEST:
      return Object.assign({}, state, {isFetching: true})
    case TRACES_RECEIVE:
      return Object.assign({}, state, {
        isFetching: false,
        traces: action.json,
        isInvalidated: false
      })
    default:
      return state
  }
}
