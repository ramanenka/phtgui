import React from 'react'
import {Link} from 'react-router'
import NavLink from 'common/components/NavLink'

export default class TraceNav extends React.Component {
  render() {
    let traceId = this.props.params.traceId
    return (<div>
      <div style={{float:'right'}}><Link className="btn btn-default" to={'/'}>Back</Link></div>
      <h1>Trace {traceId}</h1>

      <ul role="nav" className="nav nav-tabs">
        <NavLink to={"/traces/" + traceId}>General</NavLink>
        <NavLink to={"/traces/" + traceId + "/flame"}>Flame</NavLink>
      </ul>
      {this.props.children}
    </div>)
  }
}
