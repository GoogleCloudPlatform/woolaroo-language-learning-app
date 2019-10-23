import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import InputBase from '@material-ui/core/InputBase';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import './Header.css';

class Header extends React.Component {
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
        inputProps={{ 'aria-label': 'search' }}
      />
    );
  }

  renderAuthButton_() {
    if (this.props.hideAuthButton) {
      return null;
    }

    return (
      <Button
        variant="contained"
        color="primary"
        onClick={this.props.authAction}
        key={1}
      >
        {this.props.signedIn ? 'Log out' : 'Sign in'}
      </Button>
    );
  }

  render() {
    return (
      <div className="header-container">
        <AppBar position="static" className="header">
          <Toolbar>
            <h1 className="header-title">
              Barnard
            </h1>
            <div
              className={`header-search ${!this.props.signedIn && 'hidden'}`}>
              {this.renderHeaderSearch_()}
            </div>
            {this.renderAuthButton_()}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default Header;
