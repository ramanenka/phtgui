import React from 'react'
import {connect} from 'react-redux'
import Bar from './bar'
import {resizeFlame} from '../actions'

class FlameBase extends React.Component {
  render() {
    let {isFetching, event} = this.props
    if (isFetching) {
      return (<div>Loading...</div>)
    }

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
              height={maxLevel * 16}
              ref={svg => this.svg = svg}>
      {bars}
    </svg>)
  }

  componentDidMount() {
    window.setTimeout(() => {
      this.props.onResize(this.svg.width.baseVal.value)
    }, 0)
  }
}

const Flame = connect(
  state => ({
    event: state.flame.root,
    isFetching: state.flame.isFetching
  }),
  dispatch => ({
    onResize: (width) => {
      dispatch(resizeFlame(width))
    }
  })
)(FlameBase)

export default Flame
