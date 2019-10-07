import React from 'react';
import ReactDOM from 'react-dom';
import AddWordsListItem from './AddWordsListItem';

let fetchSpy;
const stubbedTranslation = {
  english_word: "",
  sound_link: "",
  translation: "",
  transliteration: "",
  id: "1",
};

it('renders without crashing when translation of correct structure is passed in', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AddWordsListItem item={stubbedTranslation}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
