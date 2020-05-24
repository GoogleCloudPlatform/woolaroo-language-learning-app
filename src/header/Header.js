import React from "react";
import AppBar from "@material-ui/core/AppBar";
import InputBase from "@material-ui/core/InputBase";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import ExpandIcon from "@material-ui/icons/ExpandMore";
import { withRouter } from "react-router-dom";
import { Breakpoint } from "react-socks";
import { Menu, MenuItem } from "@material-ui/core";
import "./Header.scss";
import HamburgerNavMenu from "../navmenu/HamburgerNavMenu";
import AuthUtils from "../utils/AuthUtils";
import GoogleLogo from "../assets/google-logo.png";

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.handleKeyUp_ = this.handleKeyUp_.bind(this);
    this.handleChange_ = this.handleChange_.bind(this);
    this.doSearch_ = this.doSearch_.bind(this);

    const queryStringParams = new URLSearchParams(props.location.search);
    const needsRecording = queryStringParams.get("needsRecording");
    const top500 = queryStringParams.get("top500");

    this.state = {
      search: this.sanitizeInput_(queryStringParams.get("search")),
      top500: top500 !== "0",
      needsRecording: !!(needsRecording && needsRecording !== "0"),
      anchorEl: null
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      const queryStringParams = new URLSearchParams(this.props.location.search);
      const needsRecording = queryStringParams.get("needsRecording");
      const top500 = queryStringParams.get("top500");
      this.setState({
        search: this.sanitizeInput_(queryStringParams.get("search")),
        top500: top500 !== "0",
        needsRecording: !!(needsRecording && needsRecording !== "0"),
      });
    }
  }

  handleChange_(e) {
    this.setState({
      search: this.sanitizeInput_(e.target.value),
    });
  }

  handleKeyUp_(e) {
    if (e.keyCode === 13) {
      this.doSearch_();
    }
  }

  sanitizeInput_(text) {
    if (!text) return "";
    return text.trim().toLowerCase();
  }

  doSearch_() {
    let nextHistory = `/?search=${this.state.search}`;

    this.props.history.push(nextHistory);
  }

  renderHeaderSearch_() {
    if (!this.props.signedIn) {
      return null;
    }

    return (
      <InputBase
        placeholder="Search"
        classes={{
          root: "header-search-root",
          input: "header-search-input",
        }}
        inputProps={{ "aria-label": "search" }}
        value={this.state.search}
        onChange={this.handleChange_}
        onKeyUp={this.handleKeyUp_}
      />
    );
  }

  handleClickProfileMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget});
  };

  renderAuthButton_() {
    if (this.props.authInitializing) {
      return null;
    }

    if (this.props.signedIn) {
      return (
        <div>
          <div className="profile-container" aria-controls="sign-out-menu" aria-haspopup="true" onClick={this.handleClickProfileMenu}>
            <div className="google-logo-container">
              <img src={GoogleLogo} alt="Google Logo" />
            </div>
            <div className="profile-picture-container">
              <img
                src={AuthUtils.getUser().photoURL}
                alt="User Profile Picture"
              />
            </div>
          </div>
          <Menu
           id="sign-out-menu"
           anchorEl={this.state.anchorEl}
           keepMounted
           open={Boolean(this.state.anchorEl)}
          >
            <MenuItem
              key="sign-out"
            >
              Sign Out
            </MenuItem>
          </Menu>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className="header-container">
        <AppBar position="static" className="header">
          {/* Only renders the hamburger menu in mobile widths. */}
          <Breakpoint medium down>
            {/* Hide the menu completely while auth is initializing. Once that is done, but
             * before the user logs in, the menu will only show the 'Sign in' option. */}
            {this.props.authInitializing ? null : (
              <HamburgerNavMenu
                signedIn={this.props.signedIn}
                authAction={this.props.authAction}
              />
            )}
          </Breakpoint>
          <Toolbar>
            <h1
              className={`header-title ${this.props.signedIn && "signed-in"}`}
            >
              <img
                src={this.props.logoURL}
                alt="Woolaroo"
                className="header-logo"
              />
            </h1>
            <div
              className={`header-search ${!this.props.signedIn && "hidden"}`}
            >
              <SearchIcon
                className="header-search-icon"
                onClick={this.doSearch_}
              />
              {this.renderHeaderSearch_()}
              <ExpandIcon />
            </div>
            <div
              className={`mobile-search-icon ${
                !this.props.signedIn && "hidden"
              }`}
            >
              <SearchIcon />
            </div>

            {/* Only renders the logout button for desktop. In mobile widths, the auth button
             * is part of the nav menu. */}
            <Breakpoint large up>
              {this.renderAuthButton_()}
            </Breakpoint>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withRouter(Header);
