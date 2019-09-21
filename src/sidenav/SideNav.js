import React from 'react';
import { withRouter } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import './SideNav.css';
import { ROUTES } from '../App';

class SideNav extends React.Component {
  onClick(route) {
    this.props.history.push(route);
  }

  renderMenuItem(label, route) {
    const { location } = this.props.history;
    return (
      <MenuItem
        selected={route === location.pathname}
        onClick={() => this.onClick(route)}
        className="side-nav-menu-item"
      >
        {label}
      </MenuItem>
    );
  }

  render() {
    return (
      <div className="side-nav-container">
        <Paper className="side-nav-paper">
          <MenuList className="side-nav-list">
            {this.renderMenuItem("Translations", ROUTES.TRANSLATIONS)}
            {this.renderMenuItem("User Contributions", ROUTES.CONTRIBUTIONS)}
            {this.renderMenuItem("Theme Customization", ROUTES.THEME)}
            {this.renderMenuItem("Sharing Links", ROUTES.SHARING)}
          </MenuList>
        </Paper>
      </div>
    );
  }
}

export default withRouter(SideNav);
