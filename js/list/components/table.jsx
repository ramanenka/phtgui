import React from 'react'
import {Link} from 'react-router'

export default class Table extends React.Component {
  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Wall Time</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {this.props.traces.map(trace =>
            <tr key={trace.id}>
              <td><Link to={'/traces/' + trace.id}>{trace.name}</Link></td>
              <td>{trace.wt}</td>
              <td>{trace.timestamp}</td>
            </tr>
          )}
        </tbody>
      </table>
    )
  }
}
