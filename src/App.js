import React from 'react';
import TranslationsPage from './translations/TranslationsPage';
import ThemePage from './theme/ThemePage';
import SharingPage from './sharing/SharingPage';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/translations">Translations</Link>
          </li>
          <li>
            <Link to="/theme">Theme Customization</Link>
          </li>
          <li>
            <Link to="/sharing">Sharing Links</Link>
          </li>
        </ul>

        <hr />

        <Route exact path="/translations" component={TranslationsPage} />
        <Route path="/theme" component={ThemePage} />
        <Route path="/sharing" component={SharingPage} />
      </div>
    </Router>
  );
}

export default App;
