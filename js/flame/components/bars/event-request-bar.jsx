import Bar from './bar'
import React from 'react'

export class EventRequestBar extends React.Component {
  render() {
    return <Bar {...this.props} />
  }
}
