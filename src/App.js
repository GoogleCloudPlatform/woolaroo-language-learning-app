import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import TranslationsPage from './translations/TranslationsPage';
<<<<<<< HEAD
import SettingsPage from './settings/SettingsPage';
=======
import ContributionsPage from './contributions/ContributionsPage';
>>>>>>> master
import ThemePage from './theme/ThemePage';
import SharingPage from './sharing/SharingPage';
import Header from './header/Header';
import SideNav from './sidenav/SideNav';

const ROUTES = {
  TRANSLATIONS: '/',
<<<<<<< HEAD
  SETTINGS: '/settings',
=======
  CONTRIBUTIONS: '/user-contributions',
>>>>>>> master
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
<<<<<<< HEAD
              <Route exact path={ROUTES.SETTINGS} component={SettingsPage} />
=======
              <Route path={ROUTES.CONTRIBUTIONS} component={ContributionsPage} />
>>>>>>> master
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
