import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import InputBase from '@material-ui/core/InputBase';
import Toolbar from '@material-ui/core/Toolbar';
import './Header.css';

class Header extends React.Component {
  render() {
    return (
      <div className="header-container">
        <AppBar position="static" className="header">
          <Toolbar>
            <h1 className="header-title">
              Google Barnard
            </h1>
            <div className="header-search">
              <InputBase
                placeholder="Search"
                classes={{
                  root: "header-search-root",
                  input: "header-search-input",
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default Header;
