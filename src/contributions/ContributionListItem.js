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
      const { english_word, sound_link, translation,
        transliteration } = this.state;

      if (!translation) {
        this.setState({
          // todo(parikshiv) - add visible error state, also
          // figure out if any of these can be empty?
          error: true,
        })
        return;
      }

      const resp = await fetch(`${ApiUtils.origin}${ApiUtils.path}addTranslations`, {
        method: 'POST',
        body: JSON.stringify({
          english_word,
          translation,
          sound_link: sound_link || '',
          transliteration: transliteration || '',
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': await AuthUtils.getAuthHeader(),
        }
      });

      if (resp.status === 403) {
        await AuthUtils.signOut();
        return;
      }

      this.deleteContribution_(e);
    } catch(err) {
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
