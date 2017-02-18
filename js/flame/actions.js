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

export function fetchFlameTimelineIfNeeded() {
  return (dispatch, getState) => {
    let state = getState()
    if (state.flame.timeline) {
      return Promise.resolve()
    }

    let traceData = state.trace.data,
      threshold = Math.round((traceData.tsc_end - traceData.tsc_begin) / 1000)

    dispatch(requestFlameTree())
    return fetch('/api/v1/traces/' + state.trace.traceId + '/tree'
      + '?threshold=' + threshold)
      .then(response => response.json())
      .then(json => dispatch(receiveFlameTimeline(json)))
      .catch(e => console.log(e))
  }
}

export const FLAME_TIMELINE_RECEIVE = 'FLAME_TIMELINE_RECEIVE'
export function receiveFlameTimeline(json) {
  return {
    type: FLAME_TIMELINE_RECEIVE,
    data: json.root
  }
}
