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
    // TODO(smus): While the translation is being saved, show a progress bar and
    // prevent the button from being clicked again.
    await this.setStateAsync({disabled: true});

    // First, if there's a new sound_blob, we should upload it and update our
    // sound_link.
    const {sound_blob} = this.state;
    if (sound_blob) {
      const sound_link = await this.saveSoundBlob_(sound_blob);
      await this.setStateAsync({sound_link});
    }
	
	// Then, call endpoint to update the feedback/suggestion.
    try {
      let { id, english_word, primary_word, sound_link, translation,
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

      const endpoint = this.state.collectionName === 'feedback' ? 'approveSuggestions' : 'addTranslations';
      const resp = await fetch(`${ApiUtils.origin}${ApiUtils.path}${endpoint}`, {
        method: 'POST',
        body: JSON.stringify({
          id,
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
        if (this.state.collectionName === 'suggestions') {
          this.deleteItem(e);
          return;
        }
        // Flagged items use the 'approveSuggestions' endpoint, which already
        // includes deleting the feedback, so there's no need to send another BE
        // request to delete.
        this.setState({
          deleted: true,
        });       

      } else {
        await this.showPopup('Failed to save. Please try again!');
        console.error(resp.text());
        await this.setStateAsync({disabled: false});
        return;
      }
      
    } catch(err) {
      await this.showPopup('Failed to save. Please try again!');
      console.error(err);
    }
  }
  
  /** Saves audio and returns the URL. */
  saveSoundBlob_ = async (blob) => {
    try {
      const base64Audio = await blobToBase64(blob);
      const res = await fetch(`${ApiUtils.origin}${ApiUtils.path}saveAudioSuggestions`, {
        method: 'POST',
        body: base64Audio,
        headers: {
          'Authorization': await AuthUtils.getAuthHeader(),
        }
      });
      if (res.status === 403) {
        await this.showPopup('Failed to save. Please try again!');
        console.error(res.text());
        return;
      }
      return await res.text();
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
  
  async setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64 = reader.result;
      // Cut off the data:audio/webm part.
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    }
    reader.onerror = reject;
  });
}

export default ContributionListItem;
