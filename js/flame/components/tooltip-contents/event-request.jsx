import React from 'react'
import {connect} from 'react-redux'

let EventRequest = ({event}) => {
  return (
    <div key={event.tsc_begin} className={event.type}>
      <div className="title"><strong>Request</strong></div>
      <div><strong>TSC Duration</strong>: {event.tsc_end - event.tsc_begin}</div>
      <div><strong>TSC Begin</strong>: {event.tsc_begin}</div>
      <div><strong>TSC End</strong>: {event.tsc_end}</div>
    </div>
  )
}

EventRequest = connect(
  state => ({
    strings: state.flame.strings
  })
)(EventRequest)

export {EventRequest}
