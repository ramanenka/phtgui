import {FLAME_TREE_REQUEST, FLAME_TREE_RECEIVE} from './actions'

export function flame(state = {isFetching: false, tree: false}, action) {
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
    default:
      return state
  }
  return state
}
