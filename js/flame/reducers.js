import {FLAME_TREE_REQUEST, FLAME_TREE_RECEIVE} from './actions'

export function flame(state = {isFetching: false, tree: false}, action) {
  switch (action.type) {
    case FLAME_TREE_REQUEST:
      return Object.assign({}, state, {isFetching: true})
    case FLAME_TREE_RECEIVE:
      return Object.assign({}, state, {
        isFetching: false,
        tree: action.tree,
        tscBegin: action.tree.TscBegin,
        tscEnd: action.tree.TscEnd
      })
    default:
      return state
  }
  return state
}