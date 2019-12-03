import React from 'react';
import Button from '@material-ui/core/Button';
import ListItemBase from '../common/ListItemBase'
import ApiUtils from '../utils/ApiUtils';
import AuthUtils from '../utils/AuthUtils';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import './TranslationListItem.css';

class TranslationListItem extends ListItemBase {
  constructor(props) {
    super(props);

    const { translation, transliteration } = this.props.item;

    this.savedData = {
      translation,
      transliteration
    };

    this.saveTranslation_ = this.saveTranslation_.bind(this);

    this.state = {
      ...this.state,
      collectionName: 'translations',
      disabled: true,
      error: false,
    };
  }

  handleTranslationChange = (e) => {
    const newTranslation = e.target.value;
    this.setState({
      translation: newTranslation,
      disabled: newTranslation === this.savedData.translation,
    });
  }

  handleTransliterationChange = (e) => {
    const newTransliteration = e.target.value;
    this.setState({
      transliteration: newTransliteration,
      disabled: newTransliteration === this.savedData.transliteration,
    });
  }

  saveTranslation_ = async (e) => {
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
    // Then, call endpoint to update the translation.
    try {
      let { english_word, primary_word, sound_link, translation,
        transliteration, frequency } = this.state;
      english_word = (""+english_word).trim();
      primary_word = (""+primary_word).trim();
      translation = (""+translation).trim();
      transliteration = (""+transliteration).trim();
      
      // If we have no data for this entry, show an error.
      if (!sound_link && !translation && !transliteration) {
        this.setState({
          // TODO(parikshiv) - add visible error state, also figure out if any
          // of these can be empty?
          error: true,
        })
        return;
      }

      // Save any updated data for the translation entry.
      const resp = await fetch(`${ApiUtils.origin}${ApiUtils.path}addTranslations`, {
        method: 'POST',
        body: JSON.stringify({
          english_word,
          primary_word,
          sound_link,
          translation,
          transliteration,
          frequency,
        }),
        headers: {
          'Authorization': await AuthUtils.getAuthHeader(),
          'Content-Type': 'application/json',
        }
      });
      if (resp.status === 200) {
        await this.showPopup('Saved!');
        this.savedData = {
          translation,
          transliteration
        };
        
        this.setState({
          disabled: true,
        });  
        await this.actionaftersaving();
      } else {
        await this.showPopup('Failed to save. Please try again!');
        console.errpr(resp.text());
        await this.setStateAsync({disabled: false});
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
  actionaftersaving(){
    //do nothing. to be overwritten in other functions to do things like remove the row
    return;
  }
  renderEndOfRow() {
    const endOfRow = [
      <Button
        variant="contained"
        color="primary"
        disabled={this.state.disabled}
        onClick={this.saveTranslation_}
        key={0}
        className="save-button"
      >
        Save
      </Button>
    ];

    endOfRow.push(
      <IconButton
        aria-label="delete"
        className="delete-translation"
        key={1}
        onClick={this.showDeleteConfirm_}
      >
        <DeleteIcon />
      </IconButton>
    );

    return endOfRow;
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

export default TranslationListItem;
