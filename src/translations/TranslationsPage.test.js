import React from 'react';
import ReactDOM from 'react-dom';
import { TranslationsPage } from './TranslationsPage';
import TranslationListItem from './TranslationListItem';
import ApiUtils from '../utils/ApiUtils';
import { BrowserRouter as Router } from 'react-router-dom';
import { shallow } from 'enzyme';

let fetchSpy;

beforeEach(() => {
  fetchSpy = jest.spyOn(window, 'fetch');
});

afterEach(() => {
  fetchSpy.mockClear();
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TranslationsPage location={{search: ''}}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('makes the correct call to fetch translations', () => {
  const wrapper = shallow(<TranslationsPage location={{search: ''}} />);

  expect(fetchSpy).toHaveBeenCalledTimes(1);
  expect(fetchSpy).toHaveBeenCalledWith(ApiUtils.origin + ApiUtils.path +
    "getEntireCollection?collectionName=translations&pageNum=1&pageSize=25");
});

it('renders correct number of TranslationListItem elements', () => {
  const wrapper = shallow(<TranslationsPage location={{search: ''}} />);
  wrapper.setState({
    items: [
      {
        english_word: "test"
      },
      {
        english_word: "this"
      },
      {
        english_word: "feature"
      },
    ],
    loading: false,
  });

  expect(wrapper.find(TranslationListItem).length).toEqual(3);
});
