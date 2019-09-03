import React from 'react';
import ReactDOM from 'react-dom';
import ThemePage from './ThemePage';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ThemePage />, div);
  ReactDOM.unmountComponentAtNode(div);
});
