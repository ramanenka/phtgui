import React from 'react'
import {connect} from 'react-redux'

let EventCompileFile = ({event, strings}) => {
  return (
    <div  key={event.tsc_begin} className={event.type}>
      <div className="title"><strong>{strings[event.filename_id]}</strong></div>
      <div><strong>Filename</strong>: {strings[event.filename_id]}</div>
      <div><strong>TSC Duration</strong>: {event.tsc_end - event.tsc_begin}</div>
      <div><strong>TSC Begin</strong>: {event.tsc_begin}</div>
      <div><strong>TSC End</strong>: {event.tsc_end}</div>
    </div>
  )
}

EventCompileFile = connect(
  state => ({
    strings: state.flame.strings
  })
)(EventCompileFile)

export {EventCompileFile}
