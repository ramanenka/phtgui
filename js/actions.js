export const TRACES_REQUEST = 'TRACES_REQUEST'

function requestTraces(filter = {}) {
  return {
    type: TRACES_REQUEST,
    filter
  }
}

export const TRACES_RECEIVE = 'TRACES_RECEIVE'

function receiveTraces(json) {
  return {
    type: TRACES_RECEIVE,
    json,
    receivedAt: Date.now()
  }
}

export function fetchTraces() {
  return dispatch => {
    dispatch(requestTraces())
    return fetch('/api/v1/traces')
      .then(response => response.json())
      .then(json => dispatch(receiveTraces(json)))
      .catch(e => console.log(e))
  }
}
