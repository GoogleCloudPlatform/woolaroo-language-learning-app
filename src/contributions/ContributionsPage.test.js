import React from 'react';
import ReactDOM from 'react-dom';
import ContributionsPage from './ContributionsPage';
import ContributionListItem from './ContributionListItem';
import ApiUtils from '../utils/ApiUtils';
import { shallow } from 'enzyme';

let fetchSpy;

const flushPromises = async () => new Promise(setImmediate);

beforeAll(() => {
  fetchSpy = jest.spyOn(window, 'fetch');
});

afterEach(() => {
  fetchSpy.mockClear();
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ContributionsPage />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('makes the correct call to fetch contributions/suggestions', async () => {
  const wrapper = shallow(<ContributionsPage />);

  await flushPromises();

  expect(fetchSpy).toHaveBeenCalledTimes(1);
  expect(fetchSpy).toHaveBeenCalledWith(ApiUtils.origin + ApiUtils.path +
    "getEntireCollection?collectionName=suggestions", expect.any(Object));
});

it('renders correct number of ContributionListItem elements', () => {
  const wrapper = shallow(<ContributionsPage />);
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

  expect(wrapper.find(ContributionListItem).length).toEqual(3);
});
