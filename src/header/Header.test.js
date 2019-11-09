import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import NavMenu from '../navmenu/NavMenu';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Router><Header /></Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders a <NavMenu/> when user has signed in', () => {
    const HeaderWrapper = mount(<Router><Header signedIn={true}/></Router>);

    expect(HeaderWrapper.contains(<NavMenu/>)).toEqual(true);
});

it('does not renders a <NavMenu/> when user is not signed in', () => {
    const HeaderWrapper = mount(<Router><Header /></Router>);

    expect(HeaderWrapper.contains(<NavMenu/>)).toEqual(false);
});
