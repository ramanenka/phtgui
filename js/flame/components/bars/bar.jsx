import React from 'react'
import {connect} from 'react-redux'
import {setFlameViewport} from '../../actions'

function defaultLabelFormatter(event, strings) {
  let clonedEvent = Object.assign({}, event, {children: null})
  delete clonedEvent.children
  return JSON.stringify(clonedEvent)
}

class BarBase extends React.Component {
  render() {
    let {event, level, tscScale, tsc0, strings} = this.props,
      {onClick, onMouseEnter, onMouseLeave, onMouseMove} = this.props,
      x = Math.max((event.tsc_begin - tsc0) * tscScale, 0),
      y = level * 16,
      width = Math.min((event.tsc_end - event.tsc_begin) * tscScale, 100),
      labelFormatter = this.props.labelFormatter || defaultLabelFormatter,
      text = width > 5
        ? <text x={x + "%"} y={y + 10}>&nbsp;{labelFormatter(event, strings)}</text>
        : null

    return (<g className={event.type}
        onClick={() => {onClick(event.tsc_begin, event.tsc_end)}}
        onMouseEnter={(ev) => {onMouseEnter(event, ev.clientX, ev.clientY)}}
        onMouseLeave={onMouseLeave}
        onMouseMove={(ev) => {onMouseMove(ev.clientX, ev.clientY)}}>
      <rect x={x + "%"} y={y} width={width + "%"} height="15" rx="2" ry="2" />
      {text}
    </g>)
  }
}

const Bar = connect(
  state => ({
    tscScale: 1 * 100 / (state.flame.tsc100 - state.flame.tsc0),
    tsc0: state.flame.tsc0,
    strings: state.flame.strings
  }),
  dispatch => ({
    onClick: (tsc0, tsc100) => {
      dispatch(setFlameViewport(tsc0, tsc100))
    }
  })
)(BarBase)

export default Bar
