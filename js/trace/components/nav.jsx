import React from 'react'
import {Link} from 'react-router'

export default class TraceNav extends React.Component {
  render() {
    let traceId = this.props.params.traceId
    return (<div>
      <div style={{float:'right'}}><Link className="btn btn-default" to={'/'}>Back</Link></div>
      <h1>Trace {traceId}</h1>

      <ul role="nav" className="nav nav-tabs">
        <li><Link to={"/traces/" + traceId}>General</Link></li>
        <li><Link to={"/traces/" + traceId + "/flame"}>Flame</Link></li>
      </ul>
      {this.props.children}
    </div>)
  }
}
