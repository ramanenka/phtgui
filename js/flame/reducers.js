import {FLAME_TREE_REQUEST, FLAME_TREE_RECEIVE} from './actions'
import {TRACE_CLOSE} from '../trace/actions'

const defaultState = {isFetching: false, tree: false}

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
    case TRACE_CLOSE:
      return defaultState
    default:
      return state
  }
  return state
}
