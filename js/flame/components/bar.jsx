import React from 'react'
import {connect} from 'react-redux'

class BarBase extends React.Component {
  render() {
    let {event, level, tscScale, tsc0} = this.props,
      x = (event.tsc_begin - tsc0) * tscScale,
      y = level * 16,
      width = (event.tsc_end - event.tsc_begin) * tscScale
    let text = width > 5 ? <text x={x + "%"} y={y + 10}>&nbsp;{this.getText(event)}</text> : null

    return (<g className={event.type}>
      <rect x={x + "%"} y={y} width={width + "%"} height="15" rx="2" ry="2" />
      {text}
    </g>)
  }

  getStringTailUntil(stringID, until) {
    let string = this.props.strings[stringID]
    let i = string.length
    let n = 0
    while (i > 0 && n < 2) {
      i--
      if (string[i] == until) {
        n++
      }
    }
    return i == 0 ? string : string.substring(i + 1)
  }

  getText(event) {
    let result = ''

    switch(event.type) {
      case "EventCompileFile":
        result = this.getStringTailUntil(event.filename_id, '/')
        break;
      case "EventCall":
        if (event.class_name_id) {
          result += this.getStringTailUntil(event.class_name_id, '\\') + '::'
        }
        if (event.function_name_id) {
          result += this.props.strings[event.function_name_id]
        }
        if (!result) {
          result = this.getStringTailUntil(event.filename_id, '/') + ':' + event.line_start
        }
        break;

      case "EventICall":
        if (event.class_name_id) {
          result += this.getStringTailUntil(event.class_name_id, '\\') + '::'
        }
        result += this.props.strings[event.function_name_id]
        break;

      default:
        let clonedEvent = Object.assign({}, event, {children: null})
        delete clonedEvent.children
        result = JSON.stringify(clonedEvent)
        break;
    }

    return result
  }
}

const Bar = connect(
  state => ({
    tscScale: 1 * 100 / (state.flame.tsc100 - state.flame.tsc0),
    tsc0: state.flame.tsc0,
    strings: state.flame.strings
  }),
  dispatch => ({})
)(BarBase)

export default Bar
