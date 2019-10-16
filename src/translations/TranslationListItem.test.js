import React from 'react';
import ReactDOM from 'react-dom';
import TranslationListItem from './TranslationListItem';
import Button from '@material-ui/core/Button';
import ApiUtils from '../utils/ApiUtils';
import TextField from '@material-ui/core/TextField';
import { shallow } from 'enzyme';

let fetchSpy;
const stubbedTranslation = {
  english_word: "dog",
  sound_link: "https://gcs/efwfefxs.mp3",
  translation: "狗",
  transliteration: "gau",
  id: "dog",
};

const stubbedEmptyTranslation = {
  ...stubbedTranslation,
  translation: "",
  transliteration: "",
  sound_link:  "",
};

const flushPromises = async () => new Promise(setImmediate);

beforeAll(() => {
  fetchSpy = jest.spyOn(window, 'fetch');
});

afterEach(() => {
  fetchSpy.mockClear();
});

it('renders without crashing when translation of correct structure is passed in', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TranslationListItem item={stubbedTranslation}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders correct elements for translation list item', () => {
  const wrapper = shallow(<TranslationListItem item={stubbedTranslation} />);

  expect(wrapper.find(Button).length).toEqual(1);
});

it('saves translation with non-empty translation', async () => {
  const wrapper = shallow(<TranslationListItem item={stubbedTranslation} />);

  wrapper.find(Button).simulate('click');

  await flushPromises();

  expect(fetchSpy).toHaveBeenCalledWith(ApiUtils.origin + ApiUtils.path +
    "addTranslations", expect.anything());

  expect(wrapper.state().error).toEqual(false);
});

it('does not save translation row with empty translation', async () => {
  const wrapper = shallow(
    <TranslationListItem item={stubbedEmptyTranslation} />);

  wrapper.find(Button).simulate('click');

  await flushPromises();

  expect(fetchSpy).toHaveBeenCalledTimes(0);
  expect(wrapper.state().error).toEqual(true);
});

it('disables save button if translation is unchanged', () => {
  const wrapper = shallow(<TranslationListItem item={stubbedTranslation} />);

  wrapper.find('.translation-text-field')
    .simulate('change', { target: { value: stubbedTranslation.translation }});

  expect(wrapper.state().disabled).toEqual(true);
});

it('disables save button if translation is unchanged', () => {
  const wrapper = shallow(<TranslationListItem item={stubbedTranslation} />);

  wrapper.find('.transliteration-text-field')
    .simulate('change', { target: { value: stubbedTranslation.transliteration }});

  expect(wrapper.state().disabled).toEqual(true);
});

it('enables save button when translation changes', () => {
  const wrapper = shallow(<TranslationListItem item={stubbedTranslation} />);

  wrapper.find('.translation-text-field')
    .simulate('change', { target: { value: 'new translation' }});

  expect(wrapper.state().disabled).toEqual(false);
});

it('enables save button when transliteration changes', () => {
  const wrapper = shallow(<TranslationListItem item={stubbedTranslation} />);

  wrapper.find('.transliteration-text-field')
    .simulate('change', { target: { value: 'new transliteration' }});

  expect(wrapper.state().disabled).toEqual(false);
});
