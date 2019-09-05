import React from 'react';
import TranslationsPage from './translations/TranslationsPage';
import ThemePage from './theme/ThemePage';
import SharingPage from './sharing/SharingPage';
import Header from './header/Header';
import SideNav from './sidenav/SideNav';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const ROUTES = {
  TRANSLATIONS: '/',
  THEME: '/theme',
  SHARING: '/sharing',
};

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="app-container">
          <Header/>
          <div className = "body-container">
            <SideNav/>
            <div className="page-container">
              <Route exact path={ROUTES.TRANSLATIONS} component={TranslationsPage} />
              <Route path={ROUTES.THEME} component={ThemePage} />
              <Route path={ROUTES.SHARING} component={SharingPage} />
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export {
  App,
  ROUTES
};
