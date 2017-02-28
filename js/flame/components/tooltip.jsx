import React from 'react'
import {connect} from 'react-redux'
import * as TooltipContents from './tooltip-contents'

class Tooltip extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      event: null,
      x: 0,
      y: 0
    }
  }

  render() {
    let {event} = this.state,
      content, display

    if (event) {
      let TooltipContent = TooltipContents[event.type]
      content = <TooltipContent event={event} />
      display = 'block'
    } else {
      display = 'none'
    }

    return (
      <div className="flame-tooltip" ref={div => {this.div = div}}
        style={{display}}>
        {content}
      </div>
    )
  }

  componentDidUpdate() {
    let {x, y} = this.state
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

export default Tooltip
