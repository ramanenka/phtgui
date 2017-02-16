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
      traceData = state.trace.data,
      tscBegin = (traceData.tsc_end - traceData.tsc_begin) * state.flame.x0 / 100 + traceData.tsc_begin,
      tscEnd = (traceData.tsc_end - traceData.tsc_begin) * state.flame.x100 / 100 + traceData.tsc_begin,
      threshold = Math.round((tscEnd - tscBegin) / state.flame.width / window.devicePixelRatio)

    dispatch(requestFlameTree())
    return fetch('/api/v1/traces/' + state.trace.traceId + '/tree'
      + '?tsc_begin=' + tscBegin
      + '&tsc_end=' + tscEnd
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
