import React from 'react'
import {connect} from 'react-redux'

class TimelineBase extends React.Component {
  render() {
    let {timeline, traceData, width, height, tsc0, tsc100} = this.props,
      points = []

    if (!timeline) {
      return null
    }

    for (let {tsc, level} of timeline.series) {
      let x = (tsc - traceData.tsc_begin) / (traceData.tsc_end - traceData.tsc_begin) * width,
        y = level / timeline.maxLevel * height

      points.push(`${x} ${y}`)
    }

    tsc100 = (tsc100 - tsc0) / (traceData.tsc_end - traceData.tsc_begin) * 100
    tsc0 = tsc0 / (traceData.tsc_end - traceData.tsc_begin) * 100

    return (
      <g>
        <rect x="0" y="0" width="100%" height={height} fill="transparent"/>
        <polygon points={points.join(', ')} stroke="#63a0d4" fill="#9fc5e5" strokeWidth="0.5"/>
        <rect x={tsc0 + "%"} y="0" width={tsc100 + "%"} height={height} fill="rgba(99, 160, 212, 0.5)" stroke="#63a0d4" />
      </g>
    )
  }
}

const Timeline = connect(
  (state) => ({
    traceData: state.trace.data,
    timeline: state.flame.timeline,
    width: state.flame.width,
    tsc0: state.flame.tsc0,
    tsc100: state.flame.tsc100
  }),
  (dispatch) => ({})
)(TimelineBase)

export default Timeline
