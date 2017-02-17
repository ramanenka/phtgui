import {
  FLAME_TREE_REQUEST,
  FLAME_TREE_RECEIVE,
  FLAME_RESIZE,
  FLAME_CLOSE,
  FLAME_SET_VIEWPORT
} from './actions'

import {TRACE_RECEIVE, TRACE_CLOSE} from '../trace/actions'

const defaultState = {
  isFetching: false,
  tree: false,
  tsc0: -1,
  tsc100: -1,
  width: 0
}

export function flame(state = defaultState, action) {
  switch (action.type) {
    case FLAME_TREE_REQUEST:
      return Object.assign({}, state, {isFetching: true})
    case FLAME_TREE_RECEIVE:
      return Object.assign({}, state, {
        isFetching: false,
        root: action.root,
        strings: action.strings
      })
    case FLAME_RESIZE:
      return Object.assign({}, state, {width: action.width})
    case FLAME_CLOSE:
      return Object.assign({}, state, {width: 0})
    case TRACE_RECEIVE:
      return Object.assign({}, state, {
        tsc0: action.data.tsc_begin,
        tsc100: action.data.tsc_end
      })
    case FLAME_SET_VIEWPORT:
      return Object.assign({}, state, {
        tsc0: action.tsc0,
        tsc100: action.tsc100
      })
    case TRACE_CLOSE:
      return defaultState
    default:
      return state
  }
  return state
}
