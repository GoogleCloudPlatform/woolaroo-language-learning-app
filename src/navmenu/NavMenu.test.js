import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import NavMenu from './NavMenu';
import { ROUTES } from '../App';

it('renders without crashing (inside of a Router)', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Router><NavMenu /></Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders a <MenuItem/> nav link for each of the routes specified in App.js',
  () => {
    const NavMenuWrapper = mount(<Router><NavMenu /></Router>);

    const numRoutes = Object.keys(ROUTES).length;
    //-2 for moderator. Future To Do: add separate test for admin vs moderator
    expect(NavMenuWrapper.find('li.nav-menu-item').length)    
      .toEqual(numRoutes-3);
    //Add word is a button now [reduced number and added new test]
});

it('renders a Add Word Button in the Nav menu',
  () => {
    const NavMenuWrapper = mount(<Router><NavMenu /></Router>);
    //-2 for moderator. Future To Do: add separate test for admin vs moderator
    expect(NavMenuWrapper.find('div.add-word').length).toEqual(1);
});
