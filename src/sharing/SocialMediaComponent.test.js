
import React from 'react';
import ReactDOM from 'react-dom';
import SocialMediaComponent from './SocialMediaComponent';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SocialMediaComponent />, div);
  ReactDOM.unmountComponentAtNode(div);
});