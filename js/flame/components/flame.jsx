import React from 'react'
import {connect} from 'react-redux'
import Bar from './bar'
import {resizeFlame} from '../actions'

class FlameBase extends React.Component {
  render() {
    let {event} = this.props
    let bars = []
    let maxLevel = 0
    let traverse = (event, level = 0) => {
      if (level > maxLevel) {
        maxLevel = level
      }
      bars.push(<Bar key={event.tsc_begin} level={level} event={event} />)
      for (let child of event.children) {
        traverse(child, level + 1)
      }
    }

    if (event) {
      traverse(event)
    }

    return (<svg xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height={(maxLevel + 1) * 16}
              ref={svg => {this.svg = svg}}>
      {bars}
    </svg>)
  }

  componentDidMount() {
    let svg = this.svg
    let onResize = this.props.onResize

    setTimeout(() => {
      onResize(svg.width.baseVal.value)
    }, 0)
  }
}

const Flame = connect(
  state => ({
    event: state.flame.root
  }),
  dispatch => ({
    onResize: (width) => {
      dispatch(resizeFlame(width))
    }
  })
)(FlameBase)

export default Flame
