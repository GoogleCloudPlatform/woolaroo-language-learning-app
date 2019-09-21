import React from 'react';
import ReactDOM from 'react-dom';
import ContributionListItem from './ContributionListItem';

it('renders without crashing when translation of correct structure is passed in', () => {
  const div = document.createElement('div');
  const stubbedTranslation = {
    english_word: "dog",
    sound_link: "https://gcs/efwfefxs.mp3",
    translation: "狗",
    transliteration: "gau",
    id: "SWoPal;isjfl;kadfjs",
  };
  ReactDOM.render(<ContributionListItem item={stubbedTranslation}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
