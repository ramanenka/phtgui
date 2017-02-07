import {TRACE_OPEN, TRACE_CLOSE} from './actions'

export function trace(state = {}, action) {
  switch(action.type) {
    case TRACE_OPEN:
      return {traceId: action.traceId}
    case TRACE_CLOSE:
      return {}
    default:
      return state
  }
}
