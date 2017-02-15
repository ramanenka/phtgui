export const FLAME_TREE_REQUEST = 'FLAME_TREE_REQUEST'

function requestFlameTree() {
  return {
    type: FLAME_TREE_REQUEST
  }
}

export const FLAME_TREE_RECEIVE = 'FLAME_TREE_RECEIVE'

function receiveFlameTree(json) {
  return {
    type: FLAME_TREE_RECEIVE,
    root: json.root,
    strings: json.strings
  }
}

export function fetchFlameTree() {
  return (dispatch, getState) => {
    let state = getState()
    dispatch(requestFlameTree())
    return fetch('/api/v1/traces/' + state.trace.traceId + '/tree')
      .then(response => response.json())
      .then(json => dispatch(receiveFlameTree(json)))
      .catch(e => console.log(e))
  }
}

export const FLAME_RESIZE = 'FLAME_RESIZE'
export function resizeFlame(width) {
  return {
    type: FLAME_RESIZE,
    width
  }
}
