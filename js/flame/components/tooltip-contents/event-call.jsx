import React from 'react'
import {connect} from 'react-redux'

let EventCall = ({event, strings}) => {
  let title = ''

  if (event.class_name_id) {
    title += strings[event.class_name_id] + '::'
  }

  if (event.function_name_id) {
    title += strings[event.function_name_id]
  }

  if (!title) {
    title = strings[event.filename_id] + ':' + event.line_start
  }

  let className = event.class_name_id
    ? <div><strong>Class Name</strong>: {strings[event.class_name_id]}</div>
    : null

  let functionName = event.function_name_id
    ? <div><strong>Function Name</strong>: {strings[event.function_name_id]}</div>
    : null

  return (
    <div key={event.tsc_begin} className={event.type}>
      <div className="title"><strong>{title}</strong></div>
      {className}
      {functionName}
      <div><strong>Filename</strong>: {strings[event.filename_id]}</div>
      <div><strong>Line Start</strong>: {event.line_start}</div>
      <div><strong>TSC Duration</strong>: {event.tsc_end - event.tsc_begin}</div>
      <div><strong>TSC Begin</strong>: {event.tsc_begin}</div>
      <div><strong>TSC End</strong>: {event.tsc_end}</div>
    </div>
  )
}

EventCall = connect(
  state => ({
    strings: state.flame.strings
  })
)(EventCall)

export {EventCall}
