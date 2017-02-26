import React from 'react'
import {connect} from 'react-redux'

class TooltipBase extends React.Component {
  render() {
    let {event} = this.props

    let text, display

    if (event) {
      event = Object.assign({}, event, {children: null})
      delete event.children
      text = JSON.stringify(event)

      display = 'block'
    } else {
      display = 'none'
    }

    return (
      <div className="flame-tooltip" ref={div => {this.div = div}}
        style={{display}}>

        {text}
      </div>
    )
  }

  componentDidUpdate() {
    let {x, y} = this.props
      x += window.scrollX
      y += window.scrollY

    let top = (y + 20) + 'px',
      left = (x + 20) + 'px',
      width = this.div.offsetWidth,
      maxWidth = window.innerWidth + window.scrollX,
      height = this.div.offsetHeight,
      maxHeight = window.innerHeight + window.scrollY

    if (x + 20 + width + 20 >= maxWidth) {
      left = (x - 20 - width) + 'px'
    }

    if (y + 20 + height + 20 >= maxHeight) {
      top = (y - 20 - height) + 'px'
    }

    this.div.style.top = top
    this.div.style.left = left
  }
}

const Tooltip = connect(
  state => ({}),
  dispatch => ({})
)(TooltipBase)

export default Tooltip
