import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import SideNav from './SideNav';
import { ROUTES } from '../App';

it('renders without crashing (inside of a Router)', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Router><SideNav /></Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders a <MenuItem/> nav link for each of the routes specified in App.js',
  () => {
    const sideNavWrapper = mount(<Router><SideNav /></Router>);

    const numRoutes = Object.keys(ROUTES).length;
    expect(sideNavWrapper.find('li.side-nav-menu-item').length)
      .toEqual(numRoutes);
});
