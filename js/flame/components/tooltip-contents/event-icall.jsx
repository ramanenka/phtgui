import React from 'react'
import {connect} from 'react-redux'

let EventICall = ({event, strings}) => {
  let title = ''

  if (event.class_name_id) {
    title += strings[event.class_name_id] + '::'
  }

  title += strings[event.function_name_id]

  let className = event.class_name_id
    ? <div><strong>Class Name</strong>: {strings[event.class_name_id]}</div>
    : null

  return (
    <div key={event.tsc_begin} className={event.type}>
      <div className="title"><strong>{title}</strong></div>
      {className}
      <div><strong>Function Name</strong>: {strings[event.function_name_id]}</div>
      <div><strong>TSC Duration</strong>: {event.tsc_end - event.tsc_begin}</div>
      <div><strong>TSC Begin</strong>: {event.tsc_begin}</div>
      <div><strong>TSC End</strong>: {event.tsc_end}</div>
    </div>
  )
}

EventICall = connect(
  state => ({
    strings: state.flame.strings
  })
)(EventICall)

export {EventICall}
