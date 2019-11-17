import React from 'react';
import { slide as SlideMenu } from 'react-burger-menu'
import NavMenu from './NavMenu'
import './HamburgerNavMenu.css';

/** 
  * Wrapper around NavMenu, used for mobile widths. This renders
  * a hamburger icon that controls a sliding menu.
  */
class HamburgerNavMenu extends React.Component {
  constructor(props) {
    super(props);

    this.handleStateChange = this.handleStateChange.bind(this);

    this.state = {
      menuOpen: false,
    }
  }

  closeMenu() {
    this.setState({menuOpen: false});
  }

  handleStateChange(state) {
    this.setState({menuOpen: state.menuOpen});
  }

  render() {
    return (
      <SlideMenu isOpen={this.state.menuOpen} onStateChange={this.handleStateChange}>
        <NavMenu isMobileMenu={true} closeSideMenu={this.closeMenu.bind(this)} />
      </SlideMenu>
    );
  }
}

export default HamburgerNavMenu;
