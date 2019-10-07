import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import AddWordsPage from './addWords/AddWordsPage';
import TranslationsPage from './translations/TranslationsPage';
import ContributionsPage from './contributions/ContributionsPage';
import ThemePage from './theme/ThemePage';
import SharingPage from './sharing/SharingPage';
import ManagementPage from './management/ManagementPage';
import Header from './header/Header';
import SideNav from './sidenav/SideNav';

const ROUTES = {
  ADD_WORDS: '/add-words',
  TRANSLATIONS: '/',
  CONTRIBUTIONS: '/user-contributions',
  THEME: '/theme',
  SHARING: '/sharing',
  MANAGEMENT: '/management',
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
              <Route path={ROUTES.ADD_WORDS} component={AddWordsPage} />
              <Route exact path={ROUTES.TRANSLATIONS} component={TranslationsPage} />
              <Route path={ROUTES.CONTRIBUTIONS} component={ContributionsPage} />
              <Route path={ROUTES.THEME} component={ThemePage} />
              <Route path={ROUTES.SHARING} component={SharingPage} />
              <Route path={ROUTES.MANAGEMENT} component={ManagementPage} />
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
