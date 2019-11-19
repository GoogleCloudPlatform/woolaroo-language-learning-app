import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import  { Breakpoint, BreakpointProvider } from 'react-socks';
import './App.css';
import AddWordsPage from './addWords/AddWordsPage';
import { TranslationsPageWithRouter } from './translations/TranslationsPage';
import ContributionsPage from './contributions/ContributionsPage';
import ThemePage from './theme/ThemePage';
import AuthUtils from './utils/AuthUtils';
import SharingPage from './sharing/SharingPage';
import ManagementPage from './management/ManagementPage';
import Header from './header/Header';
import NavMenu from './navmenu/NavMenu';

const ROUTES = {
  ADD_WORDS: '/add-words',
  TRANSLATIONS: '/',
  CONTRIBUTIONS: '/user-contributions',
  THEME: '/theme',
  SHARING: '/sharing',
  MANAGEMENT: '/management',
};

const LANDING_IMG = "https://storage.googleapis.com/barnard-public-assets/Barnard%20lock%20up%202.1.png";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.authUtils_ = new AuthUtils();

    this.state = {
      email: null,
      authInitializing: true,
    };
  }

  componentDidMount() {
    this.authUtils_.getFirebaseAuth().onAuthStateChanged(async (user) => {
      if (!user) {
        this.setState({email: null, authInitializing: false});
        return;
      }

      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.admin || idTokenResult.claims.moderator) {
        AuthUtils.setUser(user);
        this.setState({email: user.email, authInitializing: false});
      } else {
        this.logOut_();
      }
    });
  }

  async logIn_() {
    try {
      await this.authUtils_.signInWithPopup();
    } catch(err) {
      console.error(err);
    }
  }

  async logOut_() {
    try {
      await AuthUtils.signOut();
    } catch(err) {
      console.error(err);
    }
  }

  async authAction_() {
    if (this.state.email) {
      this.logOut_();
    } else {
      this.logIn_();
    }
  }

  renderBody() {
    if (this.state.authInitializing) {
      return null;
    } else if (!this.state.email) {
      return (
        <div className = "body-container">
          <div className = "page-container logged-out">
            <img
              src={LANDING_IMG}
              alt=""
              className="landing-page-img"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="body-container">
        {/* Only renders the permanent side menu in desktop widths. */}
        <Breakpoint large up>
          {!!this.state.email ? <NavMenu /> : null}
        </Breakpoint>     
        <div className="body-margin" />
        <div className="page-container">
          <Route path={ROUTES.ADD_WORDS} component={AddWordsPage} />
          <Route exact path={[ROUTES.TRANSLATIONS, "/translations/:pageNum"]} component={TranslationsPageWithRouter} />
          <Route path={ROUTES.CONTRIBUTIONS} component={ContributionsPage} />
          <Route path={ROUTES.THEME} component={ThemePage} />
          <Route path={ROUTES.SHARING} component={SharingPage} />
          <Route path={ROUTES.MANAGEMENT} component={ManagementPage} />
        </div>
        <div className="body-margin" />
      </div>
    );
  }

  render() {
    return (
      <Router>
        <BreakpointProvider>
          <div className="app-container">
            <Header
              signedIn={!!this.state.email}
              authInitializing={this.state.authInitializing}
              authAction={() => this.authAction_()}
            />
            {this.renderBody()}
          </div>
        </BreakpointProvider>
      </Router>
    );
  }
}

export {
  App,
  ROUTES
};
