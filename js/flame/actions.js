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
    tree: json
  }
}

export function fetchFlameTree() {
  return dispatch => {
    dispatch(requestFlameTree())
    return fetch('/api/v1/traces/phtrace/tree')
      .then(response => response.json())
      .then(json => dispatch(receiveFlameTree(json)))
      .catch(e => console.log(e))
  }
}
