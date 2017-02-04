import React from 'react'
import {Link} from 'react-router'

class Trace extends React.Component {
  render() {
    return (
      <div>
        This is trace info of "{this.props.params.traceId}"
      </div>
    )
  }
}

export default Trace
