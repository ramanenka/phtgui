import React from 'react'
import Flame from './flame'
import Tooltip from './tooltip'

class FlameContainer extends React.Component {
  render() {
    let timeoutId

    let onBarMouseEnter = (event, x, y) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = false
      }
      this.tooltip.setState({event, x, y})
    }

    let onBarMouseMove = (x, y) => {
      this.tooltip.setState({x, y})
    }

    let onBarMouseLeave = () => {
      timeoutId = setTimeout(() => {
        this.tooltip.setState({event: null})
      }, 50)
    }

    return (
      <div>
        <Flame onBarMouseEnter={onBarMouseEnter}
          onBarMouseMove={onBarMouseMove}
          onBarMouseLeave={onBarMouseLeave} />
        <Tooltip ref={(tooltip) => {this.tooltip = tooltip;}} />
      </div>
    )
  }
}

export default FlameContainer
