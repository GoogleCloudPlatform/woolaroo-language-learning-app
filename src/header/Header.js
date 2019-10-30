import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import InputBase from '@material-ui/core/InputBase';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import { withRouter } from 'react-router-dom';
import './Header.css';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.handleKeyUp_ = this.handleKeyUp_.bind(this);
    this.handleChange_ = this.handleChange_.bind(this);
    this.doSearch_ = this.doSearch_.bind(this);

    const queryStringParams = new URLSearchParams(props.location.search);

    this.state = {
      search: queryStringParams.get('search') || '',
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      const queryStringParams = new URLSearchParams(this.props.location.search);
      this.setState({search: queryStringParams.get('search') || ''});
    }
  }

  handleChange_(e) {
    this.setState({
      search: e.target.value,
    });
  }

  handleKeyUp_(e) {
    if (e.keyCode === 13) {
      this.doSearch_();
    }
  }

  doSearch_() {
    this.props.history.push(`/?search=${this.state.search}`);
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
        inputProps={{ 'aria-label': 'search' }}
        value={this.state.search}
        onChange={this.handleChange_}
        onKeyUp={this.handleKeyUp_}
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
              <SearchIcon className="header-search-icon" onClick={this.doSearch_}/>
              {this.renderHeaderSearch_()}
            </div>
            {this.renderAuthButton_()}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withRouter(Header);
