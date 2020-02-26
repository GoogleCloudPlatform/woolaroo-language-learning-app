import React from "react";
import { withRouter } from "react-router-dom";
import MenuList from "@material-ui/core/MenuList";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import "./NavMenu.scss";
import { ROUTES } from "../App";
import AuthUtils from "../utils/AuthUtils";

const TRANSLATIONS_LABEL = "Translations";

class NavMenu extends React.Component {
  onClick(route) {
    this.props.history.push(route);
    // Close the side menu (only applicable to mobile widths).
    if (this.props.isMobileMenu) {
      this.props.closeSideMenu();
    }
  }

  renderMenuItem(label, route) {
    const { location } = this.props.history;
    let selected = route === location.pathname;
    if (
      label === TRANSLATIONS_LABEL &&
      location.pathname.startsWith("/translations")
    ) {
      selected = true;
    }

    return label === "Add Word" ? (
      <div className="add-word" onClick={() => this.onClick(route)}>
        <img
          className="add-word-icon"
          src="https://www.gstatic.com/images/icons/material/colored_icons/2x/create_32dp.png"
          alt="dfsgk"
        />
        <div className="add-word-text">Add word</div>
      </div>
    ) : (
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
    if (AuthUtils.getUserType() === "admin") {
      return (
        <MenuList>
          {this.renderMenuItem("Add Word", ROUTES.ADD_WORDS)}
          {this.renderMenuItem(TRANSLATIONS_LABEL, ROUTES.TRANSLATIONS)}
          {this.renderMenuItem("User Contributions", ROUTES.CONTRIBUTIONS)}
          {this.renderMenuItem("Sharing Links", ROUTES.SHARING)}
          {this.renderMenuItem("User Management", ROUTES.MANAGEMENT)}
          {this.renderMenuItem("Settings", ROUTES.THEME)}
        </MenuList>
      );
    } else {
      return (
        <MenuList autoFocus={false}>
          {this.renderMenuItem("Add Word", ROUTES.ADD_WORDS)}
          {this.renderMenuItem(TRANSLATIONS_LABEL, ROUTES.TRANSLATIONS)}
          {this.renderMenuItem("User Contributions", ROUTES.CONTRIBUTIONS)}
          {this.renderMenuItem("Sharing Links", ROUTES.SHARING)}
        </MenuList>
      );
    }
  }
}

export default withRouter(NavMenu);
