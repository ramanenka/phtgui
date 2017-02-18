import Table from './table'
import React from 'react'
import {connect} from 'react-redux'
import {fetchTraces} from '../actions'

let TracesList = function({traces, onRefreshClick}) {
  return (
    <div>
      <h1>Traces List</h1>
      <div className="panel panel-default">
        <div className="panel-heading">
          <a className="btn btn-default" role="button" onClick={onRefreshClick}>Refresh</a>
        </div>
        <Table traces={traces} />
      </div>
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
