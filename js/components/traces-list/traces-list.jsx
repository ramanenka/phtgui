import Table from './table'
import React from 'react'
import {connect} from 'react-redux'
import {fetchTraces} from '../../actions'

let TracesList = function({traces, shouldRefetch, onRefreshClick, onNoTraces}) {
  if (shouldRefetch) {
    onNoTraces();
  }
  return (
    <div>
      <div onClick={onRefreshClick}>Refresh</div>
      <Table traces={traces} />
    </div>
  )
}

TracesList = connect(
  state => ({
    traces: state.tracesList.traces,
    shouldRefetch: state.tracesList.isInvalidated && !state.tracesList.isFetching
  }),
  dispatch => ({
      onRefreshClick: () => {
        dispatch(fetchTraces())
      },
      onNoTraces: () => {
        dispatch(fetchTraces())
      }
  })
)(TracesList)

export default TracesList
