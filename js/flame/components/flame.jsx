import React from 'react'
import {connect} from 'react-redux'
import Bar from './bar'

class FlameBase extends React.Component {
  render() {
    if (!this.props.event) {
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
    traverse(this.props.event)

    return (<svg xmlns="http://www.w3.org/2000/svg" width="100%" height={maxLevel * 16}>
      {bars}
    </svg>)
  }
}

const Flame = connect(
  state => ({
    event: state.trace.flame.root
  }),
  dispatch => ({

  })
)(FlameBase)

export default Flame
