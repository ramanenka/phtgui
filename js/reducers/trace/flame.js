import {FLAME_TREE_REQUEST, FLAME_TREE_RECEIVE} from '../../actions/trace/flame'

export function flame(state = {isFetching: false, tree: false}, action) {
  switch (action.type) {
    case FLAME_TREE_REQUEST:
      return Object.assign({}, state, {isFetching: true})
    case FLAME_TREE_RECEIVE:
      return Object.assign({}, state, {
        isFetching: false,
        tree: action.tree
      })
    default:
      return state
  }
  return state
}
