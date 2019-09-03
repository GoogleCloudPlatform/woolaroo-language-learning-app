import React from 'react';
import ReactDOM from 'react-dom';
import TranslationsPage from './TranslationsPage';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TranslationsPage />, div);
  ReactDOM.unmountComponentAtNode(div);
});
