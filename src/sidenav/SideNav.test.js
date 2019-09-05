import React from 'react';
import ReactDOM from 'react-dom';
import SideNav from './SideNav';
import { BrowserRouter as Router } from 'react-router-dom';

it('renders without crashing (inside of a Router)', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Router><SideNav /></Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});
