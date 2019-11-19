import React from 'react';
import { slide as SlideMenu } from 'react-burger-menu'
import { withRouter } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import './NavMenu.css';
import { ROUTES } from '../App';

const TRANSLATIONS_LABEL = "Translations";

class NavMenu extends React.Component {
  constructor(props) {
    super(props);

    this.handleStateChange = this.handleStateChange.bind(this);

    this.state = {
      menuOpen: false,
    }
  }
  onClick(route) {
    this.setState({menuOpen: false});
    this.props.history.push(route);
  }

  renderMenuItem(label, route) {
    const { location } = this.props.history;
    let selected = route === location.pathname;
    if (label === TRANSLATIONS_LABEL
        && location.pathname.startsWith("/translations")) {
      selected = true;
    }

    return (
      <MenuItem
        selected={selected}
        onClick={() => this.onClick(route)}
        className="nav-menu-item"
      >
        {label}
      </MenuItem>
    );
  }

  handleStateChange(state) {
    this.setState({menuOpen: state.menuOpen});
  }

  render() {
    return (
      <SlideMenu className="slide-menu" isOpen={this.state.menuOpen}
        onStateChange={this.handleStateChange}
      >
        {this.renderMenuItem("Add Words", ROUTES.ADD_WORDS)}
        {this.renderMenuItem(TRANSLATIONS_LABEL, ROUTES.TRANSLATIONS)}
        {this.renderMenuItem("User Contributions", ROUTES.CONTRIBUTIONS)}
        {this.renderMenuItem("Sharing Links", ROUTES.SHARING)}
        {this.renderMenuItem("User Management", ROUTES.MANAGEMENT)}
        {this.renderMenuItem("Settings", ROUTES.THEME)}
      </SlideMenu>
    );
  }
}

export default withRouter(NavMenu);
