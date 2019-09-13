import React from 'react';
import ReactDOM from 'react-dom';
import TranslationListItem from './TranslationListItem';

it('renders without crashing when correct translation is passed in', () => {
  const div = document.createElement('div');
  const stubbedTranslation = {
    english_word: "dog",
    sound_link: "https://gcs/efwfefxs.mp3",
    translation: "狗",
    transliteration: "gau",
  };
  ReactDOM.render(<TranslationListItem translation={stubbedTranslation}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
