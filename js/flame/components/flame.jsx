import React from 'react'
import {connect} from 'react-redux'
import * as Bars from './bars/index'
import Timeline from './timeline'
import Tooltip from './tooltip'
import {resizeFlame} from '../actions'

class FlameBase extends React.Component {
  constructor(props) {
    super(props)
    this.resizeHandler = this.resizeHandler.bind(this)
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

      let BarType = Bars[event.type + 'Bar'],
        {onBarMouseEnter, onBarMouseMove, onBarMouseLeave} = this.props

      bars.push(
        <BarType key={event.tsc_begin}
          level={level}
          event={event}
          onMouseEnter={onBarMouseEnter}
          onMouseLeave={onBarMouseLeave}
          onMouseMove={onBarMouseMove}/>
      )

      for (let child of event.children) {
        traverse(child, level + 1)
      }
    }

    if (event) {
      traverse(event)
    }

    return (<svg xmlns="http://www.w3.org/2000/svg" width="100%"
      height={(maxLevel + 1) * 16 + 50} ref={svg => {this.svg = svg}}>

      <Timeline height={50} />
      <g className="bars-container" transform="translate(0 50)">
        {bars}
      </g>
    </svg>)
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
