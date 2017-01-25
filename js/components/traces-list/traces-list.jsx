import Table from './table'
import React from 'react'
import {connect} from 'react-redux'
import {fetchTraces} from '../../actions'

let TracesList = function({traces, onRefreshClick}) {
  return (
    <div>
      <div onClick={onRefreshClick}>Refresh</div>
      <Table traces={traces} />
    </div>
  )
}

TracesList = connect(
  state => ({
    traces: state.tracesList.traces
  }),
  dispatch => ({
      onRefreshClick: () => {
        dispatch(fetchTraces())
      }
  })
)(TracesList)

export default TracesList
