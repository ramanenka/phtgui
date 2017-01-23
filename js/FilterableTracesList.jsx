import React from 'react'
import {Link} from 'react-router'

class FilterableTracesList extends React.Component {
  render() {
    return (<div>
      {this.props.route.traces.map(trace => {
        return (
          <div key={trace.id}>
            <Link to={'/traces/' + trace.id}>{trace.name}</Link>
          </div>
        )
      })}
    </div>)
  }
}

export default FilterableTracesList
