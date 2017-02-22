import React from 'react'
import {Link, withRouter} from 'react-router'

class NavLinkBase extends React.Component {
  render() {
    let isActive = this.props.router.isActive(this.props.to, true),
      className = isActive ? 'active' : ''

    return (<li className={className}>
      <Link to={this.props.to}>
        {this.props.children}
      </Link>
    </li>)
  }
}

const NavLink = withRouter(NavLinkBase)

export default NavLink
