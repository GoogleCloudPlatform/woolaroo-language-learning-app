import React from 'react';
import ReactDOM from 'react-dom';
import SharingPage from './SharingPage';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SharingPage />, div);
  ReactDOM.unmountComponentAtNode(div);
});
