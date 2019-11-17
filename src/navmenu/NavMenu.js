import React from 'react';
import { withRouter } from 'react-router-dom';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import './NavMenu.css';
import { ROUTES } from '../App';

const TRANSLATIONS_LABEL = "Translations";

class NavMenu extends React.Component {
  onClick(route) {
    this.props.history.push(route);
    // Close the side menu (only applicable to mobile widths).
    if (this.props.closeSideMenu) {
      this.props.closeSideMenu();
    }
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

  render() {
    return (
      <MenuList>
        {this.renderMenuItem("Add Words", ROUTES.ADD_WORDS)}
        {this.renderMenuItem(TRANSLATIONS_LABEL, ROUTES.TRANSLATIONS)}
        {this.renderMenuItem("User Contributions", ROUTES.CONTRIBUTIONS)}
        {this.renderMenuItem("Theme Customization", ROUTES.THEME)}
        {this.renderMenuItem("Sharing Links", ROUTES.SHARING)}
        {this.renderMenuItem("User Management", ROUTES.MANAGEMENT)}
      </MenuList>
    );
  }
}

export default withRouter(NavMenu);
