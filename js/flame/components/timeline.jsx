import React from 'react'
import {connect} from 'react-redux'

class TimelineBase extends React.Component {
  render() {
    let {timeline, traceData, width, height} = this.props,
      points = []

    if (!timeline) {
      return null
    }

    for (let {tsc, level} of timeline.series) {
      let x = (tsc - traceData.tsc_begin) / (traceData.tsc_end - traceData.tsc_begin) * width,
        y = level / timeline.maxLevel * height

      points.push(`${x} ${y}`)
    }

    return (
      <g>
        <rect x="0" y="0" width="100%" height={height} fill="#eff5fb"/>
        <polygon points={points.join(', ')} stroke="#63a0d4" fill="#9fc5e5"/>
      </g>
    )
  }
}

const Timeline = connect(
  (state) => ({
    traceData: state.trace.data,
    timeline: state.flame.timeline,
    width: state.flame.width
  }),
  (dispatch) => ({})
)(TimelineBase)

export default Timeline
