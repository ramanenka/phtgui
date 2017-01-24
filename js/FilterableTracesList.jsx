import React from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {fetchTraces} from './actions.js'

class FilterableTracesList extends React.Component {
  render() {
    return (<div>
      <div onClick={this.props.onRefreshClick}>Refresh</div>
      {this.props.traces.map(trace => {
        return (
          <div key={trace.id}>
            <Link to={'/traces/' + trace.id}>{trace.name}</Link>
          </div>
        )
      })}
    </div>)
  }
}

const FilterableTracesListConnected = connect(
  state => ({
    traces: state.tracesList.traces
  }),
  dispatch => ({
      onRefreshClick: () => {
        dispatch(fetchTraces())
      }
  })
)(FilterableTracesList)

export default FilterableTracesListConnected
