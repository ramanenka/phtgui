export const TRACE_OPEN = 'TRACE_OPEN'
export function openTrace(traceId) {
  return {
    type: TRACE_OPEN,
    traceId
  }
}

export const TRACE_CLOSE = 'TRACE_CLOSE'
export function closeTrace() {
  return {
    type: TRACE_CLOSE
  }
}

export const TRACE_REQUEST = 'TRACE_REQUEST'
export function requestTrace() {
  return {
    type: TRACE_REQUEST
  }
}

export const TRACE_RECEIVE = 'TRACE_RECEIVE'
export function receiveTrace(data) {
  return {
    type: TRACE_RECEIVE,
    data
  }
}

export function fetchTrace() {
  return (dispatch, getState) => {
    dispatch(requestTrace())
    let state = getState()
    return fetch('/api/v1/traces/' + state.trace.traceId)
      .then(response => response.json())
      .then(json => dispatch(receiveTrace(json)))
      .catch(e => console.log(e))
  }
}
