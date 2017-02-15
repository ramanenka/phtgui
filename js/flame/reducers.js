import {FLAME_TREE_REQUEST, FLAME_TREE_RECEIVE, FLAME_RESIZE} from './actions'
import {TRACE_CLOSE} from '../trace/actions'

const defaultState = {
  isFetching: false,
  tree: false,
  x0: 0,
  x100: 100,
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
        strings: action.strings,
        tscBegin: action.root.tsc_begin,
        tscEnd: action.root.tsc_end
      })
    case FLAME_RESIZE:
      return Object.assign({}, state, {width: action.width})
    case TRACE_CLOSE:
      return defaultState
    default:
      return state
  }
  return state
}
