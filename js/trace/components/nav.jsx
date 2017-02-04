import React from 'react'
import {Link} from 'react-router'

export default class TraceNav extends React.Component {
  render() {
    let traceId = this.props.params.traceId
    return (<div>
      <h1>Trace {traceId}</h1>
      <ul role="nav">
        <li><Link to={"/traces/" + traceId}>General</Link></li>
        <li><Link to={"/traces/" + traceId + "/flame"}>Flame</Link></li>
      </ul>
      <div><Link to={'/'}>Back</Link></div>
      {this.props.children}
    </div>)
  }
}
