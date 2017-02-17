export const FLAME_OPEN = 'FLAME_OPEN'
export function openFlame() {
  return {
    type: FLAME_OPEN
  }
}

export const FLAME_CLOSE = 'FLAME_CLOSE'
export function closeFlame() {
  return {
    type: FLAME_CLOSE
  }
}

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
    let state = getState(),
      threshold = Math.round(
        (state.flame.tsc100 - state.flame.tsc0)
        / state.flame.width
        / window.devicePixelRatio
      )

    dispatch(requestFlameTree())
    return fetch('/api/v1/traces/' + state.trace.traceId + '/tree'
      + '?tsc_begin=' + state.flame.tsc0
      + '&tsc_end=' + state.flame.tsc100
      + '&threshold=' + threshold)
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

export const FLAME_SET_VIEWPORT = 'FLAME_SET_VIEWPORT'
export function setFlameViewport(tsc0, tsc100) {
  return {
    type: FLAME_SET_VIEWPORT,
    tsc0,
    tsc100
  }
}
