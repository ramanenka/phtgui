import React from 'react'
import {connect} from 'react-redux'
import Bar from './bar'
import Timeline from './timeline'
import {resizeFlame} from '../actions'

class FlameBase extends React.Component {
  constructor(props) {
    super(props)
    this.resizeHandler = this.resizeHandler.bind(this)
  }

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
              height={(maxLevel + 1) * 16 + 50}
              ref={svg => {this.svg = svg}}>
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
    event: state.flame.root
  }),
  dispatch => ({
    onResize: (width) => {
      dispatch(resizeFlame(width))
    }
  })
)(FlameBase)

export default Flame
