import React from 'react';
import ReactDOM from 'react-dom';
import ListItemBase from './ListItemBase';

it('renders without crashing when translation of correct structure is passed in', () => {
  const div = document.createElement('div');
  const stubbedTranslation = {
    english_word: "dog",
    sound_link: "https://gcs/efwfefxs.mp3",
    translation: "狗",
    transliteration: "gau",
    id: "dog",
  };
  ReactDOM.render(<ListItemBase item={stubbedTranslation}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
