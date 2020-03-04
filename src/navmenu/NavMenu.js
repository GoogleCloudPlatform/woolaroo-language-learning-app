import React from "react";
import { withRouter } from "react-router-dom";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import "./NavMenu.scss";
import { ROUTES } from "../App";
import AuthUtils from "../utils/AuthUtils";
import Badge from "@material-ui/core/Badge";

import AddWordsPage from "../addWords/AddWordsPage";

const TRANSLATIONS_LABEL = "Translations";

class NavMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddWordOpen: false
    };
  }

  setAddWordOpen = () => {
    this.setState({ isAddWordOpen: true });

    if (this.props.isMobileMenu) {
      this.props.closeSideMenu();
    }
  };

  closeAddWord = () => {
    this.setState({ isAddWordOpen: false });
  };

  onClick(route) {
    this.props.history.push(route);
    // Close the side menu (only applicable to mobile widths).
    if (this.props.isMobileMenu) {
      this.props.closeSideMenu();
    }
  }

  getLabel = (label) => {
    if(label === "User Contributions") {
      //This displays the number of user contributions made
      return <div> User Contributions <span className="user-contributions-number"> 2 </span></div>
    }
    return label;
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
      <div className="add-word" onClick={() => this.setAddWordOpen()}>
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
        {this.getLabel(label)}
      </MenuItem>
    );
  }

  render() {
    return (
      <div>
        <AddWordsPage
          isOpen={this.state.isAddWordOpen}
          onClose={this.closeAddWord}
        />
        {AuthUtils.getUserType() === "admin" ? (
          <MenuList>
            {this.renderMenuItem("Add Word", ROUTES.ADD_WORDS)}
            {this.renderMenuItem(TRANSLATIONS_LABEL, ROUTES.TRANSLATIONS)}
            {this.renderMenuItem("User Contributions", ROUTES.CONTRIBUTIONS)}
            {this.renderMenuItem("Theme Customization", ROUTES.THEME)}
            {this.renderMenuItem("Sharing Links", ROUTES.SHARING)}
            {this.renderMenuItem("User Management", ROUTES.MANAGEMENT)}
          </MenuList>
        ) : (
          <MenuList autoFocus={false}>
            {this.renderMenuItem("Add Word", ROUTES.ADD_WORDS)}
            {this.renderMenuItem(TRANSLATIONS_LABEL, ROUTES.TRANSLATIONS)}
            {this.renderMenuItem("User Contributions", ROUTES.CONTRIBUTIONS)}
            {this.renderMenuItem("Sharing Links", ROUTES.SHARING)}
          </MenuList>
        )}
      </div>
    );
  }
}

export default withRouter(NavMenu);
