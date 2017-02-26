import React from 'react'
import {connect} from 'react-redux'
import Bar from './bar'
import Timeline from './timeline'
import Tooltip from './tooltip'
import {resizeFlame} from '../actions'

class FlameBase extends React.Component {
  constructor(props) {
    super(props)
    this.resizeHandler = this.resizeHandler.bind(this)

    this.onBarMouseEnter = this.onBarMouseEnter.bind(this)
    this.onBarMouseLeave = this.onBarMouseLeave.bind(this)
    this.onBarMouseMove = this.onBarMouseMove.bind(this)
    this.state = {
      hoverEvent: null,
      mouseX: 0,
      mouseY: 0
    }
    this.barMouseLeaveTimeoutId = false
  }

  onBarMouseEnter(event, mouseX, mouseY) {
    if (this.barMouseLeaveTimeoutId) {
      clearTimeout(this.barMouseLeaveTimeoutId)
      this.barMouseLeaveTimeoutId = false
    }
    this.setState({hoverEvent: event, mouseX, mouseY})
  }

  onBarMouseLeave() {
    this.barMouseLeaveTimeoutId = setTimeout(() => {
      this.setState({hoverEvent: null})
    }, 50)
  }

  onBarMouseMove(mouseX, mouseY) {
    this.setState({mouseX, mouseY})
  }

  render() {
    let {event, tsc0, tsc100} = this.props
    let bars = []
    let maxLevel = 0
    let traverse = (event, level = 0) => {
      if (event.tsc_end < tsc0 || event.tsc_begin > tsc100) {
        return
      }

      if (level > maxLevel) {
        maxLevel = level
      }
      bars.push(
        <Bar key={event.tsc_begin}
          level={level}
          event={event}
          onMouseEnter={this.onBarMouseEnter}
          onMouseLeave={this.onBarMouseLeave}
          onMouseMove={this.onBarMouseMove}/>
      )
      for (let child of event.children) {
        traverse(child, level + 1)
      }
    }

    if (event) {
      traverse(event)
    }

    return (<div>
      <svg xmlns="http://www.w3.org/2000/svg" width="100%"
        height={(maxLevel + 1) * 16 + 50} ref={svg => {this.svg = svg}}>

        <Timeline height={50} />
        <g className="bars-container" transform="translate(0 50)">
          {bars}
        </g>
      </svg>
      <Tooltip event={this.state.hoverEvent} x={this.state.mouseX} y={this.state.mouseY} />
    </div>)
  }

  resizeHandler() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }

    this.timeoutId = setTimeout(() => {
      this.props.onResize(this.svg.width.baseVal.value)
    }, 200)
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeHandler)
    setTimeout(() => {
      this.props.onResize(this.svg.width.baseVal.value)
    }, 0)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler)
  }
}

const Flame = connect(
  state => ({
    event: state.flame.root,
    tsc100: state.flame.tsc100,
    tsc0: state.flame.tsc0
  }),
  dispatch => ({
    onResize: (width) => {
      dispatch(resizeFlame(width))
    }
  })
)(FlameBase)

export default Flame
