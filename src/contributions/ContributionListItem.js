import React from 'react';
import ListItemBase from '../common/ListItemBase'
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Done';
import ApiUtils from '../utils/ApiUtils';
import AuthUtils from '../utils/AuthUtils';
import './ContributionListItem.css';

class ContributionListItem extends ListItemBase {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      error: false,
      collectionName: 'suggestions',
    }
  }

  saveContribution_ = async (e) => {
    try {
      let { english_word, primary_word, sound_link, translation,
        transliteration } = this.state;
      english_word = (""+english_word).trim();
      primary_word = (""+primary_word).trim();
      translation = (""+translation).trim();
      transliteration = (""+transliteration).trim();
      
      if (!translation) {
        this.setState({
          // todo(parikshiv) - add visible error state, also
          // figure out if any of these can be empty?
          error: true,
        })
        return;
      }

      const endpoint = this.state.collectionName === 'feedback' ? 'approveSuggesions' : 'addTranslations';
      const resp = await fetch(`${ApiUtils.origin}${ApiUtils.path}${endpoint}`, {
        method: 'POST',
        body: JSON.stringify({
          english_word,
          primary_word,
          translation,
          sound_link: sound_link || '',
          transliteration: transliteration || '',
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': await AuthUtils.getAuthHeader(),
        }
      });

      if (resp.status === 200) {
        this.deleteItem(e);
      } else {
        await this.showPopup('Failed to save. Please try again!');
        console.error(resp.text());
        return;
      }
      
    } catch(err) {
      await this.showPopup('Failed to save. Please try again!');
      console.error(err);
    }
  }

  renderEndOfRow() {
    return [
      <IconButton
        aria-label="save"
        className="save-contribution"
        key={0}
        onClick={this.saveContribution_}
      >
        <SaveIcon />
      </IconButton>,
      <IconButton
        aria-label="delete"
        className="delete-contribution"
        key={1}
        onClick={this.showDeleteConfirm_}
      >
        <DeleteIcon />
      </IconButton>,
    ];
  }

  render() {
    if (this.state.deleted) {
      return null;
    }

    return super.render();
  }
}

export default ContributionListItem;
