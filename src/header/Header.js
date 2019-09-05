import React from 'react';
import './Header.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';

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
