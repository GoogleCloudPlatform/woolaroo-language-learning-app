import React from 'react';
import ReactDOM from 'react-dom';
import PaginationWidget from './PaginationWidget';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PaginationWidget />, div);
  ReactDOM.unmountComponentAtNode(div);
});
