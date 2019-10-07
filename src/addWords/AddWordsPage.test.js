import React from 'react';
import ReactDOM from 'react-dom';
import AddWordsPage from './AddWordsPage';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AddWordsPage />, div);
  ReactDOM.unmountComponentAtNode(div);
});
