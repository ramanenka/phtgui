import React from 'react'
import {Link} from 'react-router'

class Trace extends React.Component {
  render() {
    return (
      <div>
        <div>This is trace info of "{this.props.params.traceId}"</div>
        <div><Link to={'/'}>Back</Link></div>
      </div>
    )
  }
}

export default Trace
