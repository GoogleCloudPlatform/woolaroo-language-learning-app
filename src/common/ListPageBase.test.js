import React from 'react';
import ReactDOM from 'react-dom';
import ListPageBase from './ListPageBase';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ListPageBase />, div);
  ReactDOM.unmountComponentAtNode(div);
});
