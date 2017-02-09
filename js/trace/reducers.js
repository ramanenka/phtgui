import {TRACE_OPEN, TRACE_CLOSE, TRACE_REQUEST, TRACE_RECEIVE} from './actions'

const defaultState = {
  isFetching: false,
  traceId: null
}

export function trace(state = defaultState, action) {
  switch(action.type) {
    case TRACE_OPEN:
      return Object.assign({}, state, {traceId: action.traceId})
    case TRACE_CLOSE:
      return defaultState
    case TRACE_REQUEST:
      return Object.assign({}, state, {isFetching: true})
    case TRACE_RECEIVE:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.data
      })
    default:
      return state
  }
}
