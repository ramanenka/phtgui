import React from 'react'
import {connect} from 'react-redux'

class Bar extends React.Component {
  render() {
    return (<g>
      <rect />
      <text>
        {JSON.stringify(
          Object.assign({}, this.props.event, {Children: null})
        )}
      </text>
    </g>)
  }
}

class FlameBase extends React.Component {
  render() {
    if (!this.props.event) {
      return (<div>Loading...</div>)
    }

    let stack = [this.props.event]
    let bars = []
    while (stack.length > 0) {
      let event = stack.shift()
      bars.push(<Bar key={event.TscBegin} event={event} />)
      if (event.Children) {
        stack.push(...event.Children)
      }
    }

    return (<svg xmlns="http://www.w3.org/2000/svg" width="100%">
      {bars}
    </svg>)
  }
}

const Flame = connect(
  state => ({
    event: state.trace.flame.tree
  }),
  dispatch => ({

  })
)(FlameBase)

export default Flame
