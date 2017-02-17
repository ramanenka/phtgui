import {fetchFlameTree} from './actions'

export function fetchFlameTreeObserver(store) {
  let lastState = {
    tsc0: -1,
    tsc100: -1,
    width: -1
  }

  let keys = Object.keys(lastState)

  let handler = function() {
    let state = store.getState()
    if (!state.trace.data || state.flame.width <= 0) {
      return
    }

    let stateChanged = false
    for (let key of keys) {
      if (lastState[key] != state.flame[key]) {
        lastState[key] = state.flame[key]
        stateChanged = true
      }
    }

    if (stateChanged) {
      store.dispatch(fetchFlameTree())
    }
  }

  let unsubscribe = store.subscribe(handler)
  handler()
  return unsubscribe
}
