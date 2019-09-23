import React from 'react';
import ReactDOM from 'react-dom';
import ContributionListItem from './ContributionListItem';
import IconButton from '@material-ui/core/IconButton';
import PlayIcon from '@material-ui/icons/PlayArrowOutlined';
import DeleteIcon from '@material-ui/icons/NotInterested';
import SaveIcon from '@material-ui/icons/Done';
import Fab from '@material-ui/core/Fab';
import ApiUtils from '../utils/ApiUtils';
import { shallow } from 'enzyme';

let fetchSpy;
const stubbedTranslation = {
  english_word: "dog",
  sound_link: "https://gcs/efwfefxs.mp3",
  translation: "狗",
  transliteration: "gau",
  id: "SWoPal;isjfl;kadfjs",
};

const stubbedEmptyTranslation = {
  ...stubbedTranslation,
  translation: "",
};

beforeAll(() => {
  fetchSpy = jest.spyOn(window, 'fetch');
});

afterEach(() => {
  fetchSpy.mockClear();
});

it('renders without crashing when translation of correct structure is passed in', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ContributionListItem item={stubbedTranslation}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders correct elements for contribution list item', () => {
  const wrapper = shallow(<ContributionListItem item={stubbedTranslation} />);

  expect(wrapper.find(Fab).length).toEqual(1);
  expect(wrapper.find(PlayIcon).length).toEqual(1);
  expect(wrapper.find(IconButton).length).toEqual(2);
  expect(wrapper.find(SaveIcon).length).toEqual(1);
  expect(wrapper.find(DeleteIcon).length).toEqual(1);
});


it('saves contribution with non-empty translation', () => {
  const wrapper = shallow(<ContributionListItem item={stubbedTranslation} />);

  wrapper.find('.save-contribution').simulate('click');

  expect(fetchSpy).toHaveBeenCalledWith(ApiUtils.origin + ApiUtils.path +
    "addTranslations", expect.anything());

  expect(wrapper.state().error).toEqual(false);
});

it('does not save contribution with empty translation', () => {
  const wrapper = shallow(
    <ContributionListItem item={stubbedEmptyTranslation} />);

  wrapper.find('.save-contribution').simulate('click');

  expect(fetchSpy).toHaveBeenCalledTimes(0);
  expect(wrapper.state().error).toEqual(true);
});

it('deletes contribution on delete button click', () => {
  const wrapper = shallow(<ContributionListItem item={stubbedTranslation} />);

  wrapper.find('.delete-contribution').simulate('click');

  expect(fetchSpy).toHaveBeenCalledWith(ApiUtils.origin + ApiUtils.path +
    "deleteRow", expect.anything());
});
