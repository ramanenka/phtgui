import Bar from './bar'
import React from 'react'
import {stringTailUntil} from '../../../utils'

function labelFormatter(event, strings) {
  return stringTailUntil(strings[event.filename_id], '/')
}

export class EventCompileFileBar extends React.Component {
  render() {
    return <Bar {...this.props} labelFormatter={labelFormatter} />
  }
}
