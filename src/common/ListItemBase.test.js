import React from 'react';
import ReactDOM from 'react-dom';
import AudioRecorder from '../audio/AudioRecorder';
import ListItemBase from './ListItemBase';
import TextField from '@material-ui/core/TextField';
import { shallow } from 'enzyme';

const stubbedTranslation = {
  english_word: "dog",
  sound_link: "https://gcs/efwfefxs.mp3",
  translation: "狗",
  transliteration: "gau",
  id: "dog",
};

it('renders without crashing when translation of correct structure is passed in', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ListItemBase item={stubbedTranslation}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders correct elements for base list item', () => {
  const wrapper = shallow(<ListItemBase item={stubbedTranslation} />);

  expect(wrapper.find(AudioRecorder).length).toEqual(1);
  expect(wrapper.find(TextField).length).toEqual(2);
  expect(wrapper.find('.base-word').length).toEqual(1);
});
