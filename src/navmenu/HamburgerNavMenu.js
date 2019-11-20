import React from 'react';
import { slide as SlideMenu } from 'react-burger-menu'
import Button from '@material-ui/core/Button';
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
        {this.props.signedIn ?
          <NavMenu isMobileMenu={true} closeSideMenu={this.closeMenu.bind(this)} /> : null
        }
        <Button
          variant='contained'
          color='primary'
          onClick={this.props.authAction}
          className='menu-auth-button'
          key={1}
        >
          {this.props.signedIn ? 'Log out' : 'Sign in'}
        </Button>
      </SlideMenu>
    );
  }
}

export default HamburgerNavMenu;
