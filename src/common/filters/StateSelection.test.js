import React from 'react';
import ReactDOM from 'react-dom';
import StateSelection from './StateSelection';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<StateSelection />, div);
  ReactDOM.unmountComponentAtNode(div);
});
