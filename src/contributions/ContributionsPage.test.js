import React from 'react';
import ReactDOM from 'react-dom';
import ContributionsPage from './ContributionsPage';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ContributionsPage />, div);
  ReactDOM.unmountComponentAtNode(div);
});
