import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import { App } from './App';
import Header from './header/Header';
import SideNav from './sidenav/SideNav';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders a header', () => {
  const wrapper = shallow(<App />);
  expect(wrapper.contains(<Header/>)).toEqual(true);
});

it('renders a side nav', () => {
  const wrapper = shallow(<App />);
  expect(wrapper.contains(<SideNav/>)).toEqual(true);
});
