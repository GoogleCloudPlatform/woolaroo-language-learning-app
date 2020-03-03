import React from 'react';
import ReactDOM from 'react-dom';
import ManagementPage from './ManagementPage';
import { Breakpoint } from "react-socks";

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Breakpoint><ManagementPage /></Breakpoint>, div);
  ReactDOM.unmountComponentAtNode(div);
});
