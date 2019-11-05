import React from 'react';
import { slide as SlideMenu } from 'react-burger-menu'
import { withRouter } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import './NavMenu.css';
import { ROUTES } from '../App';

const TRANSLATIONS_LABEL = "Translations";

class NavMenu extends React.Component {
  onClick(route) {
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
      <MenuItem selected={selected} onClick={() => this.onClick(route)}>
        {label}
      </MenuItem>
    );
  }

  render() {
    return (
      <SlideMenu className="slide-menu">
        {this.renderMenuItem("Add Words", ROUTES.ADD_WORDS)}
        {this.renderMenuItem(TRANSLATIONS_LABEL, ROUTES.TRANSLATIONS)}
        {this.renderMenuItem("User Contributions", ROUTES.CONTRIBUTIONS)}
        {this.renderMenuItem("Theme Customization", ROUTES.THEME)}
        {this.renderMenuItem("Sharing Links", ROUTES.SHARING)}
        {this.renderMenuItem("User Management", ROUTES.MANAGEMENT)}
      </SlideMenu>
    );
  }
}

export default withRouter(NavMenu);
