import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import { App } from './App';
import Header from './header/Header';
import NavMenu from './navmenu/NavMenu';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders only a header while waiting for auth credentials', () => {
  const wrapper = shallow(<App />);
  expect(wrapper.containsMatchingElement(<Header/>)).toEqual(true);
});

it('renders only a header and a landing image if user is not signed in', () => {
  const wrapper = shallow(<App />);
  wrapper.setState({authInitializing: false});
  expect(wrapper.containsMatchingElement(<Header/>)).toEqual(true);
  expect(wrapper.containsMatchingElement(<img/>)).toEqual(true);
});
