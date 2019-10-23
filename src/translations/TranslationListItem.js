import React from 'react';
import Button from '@material-ui/core/Button';
import ListItemBase from '../common/ListItemBase'
import ApiUtils from '../utils/ApiUtils';
import './TranslationListItem.css';

class TranslationListItem extends ListItemBase {
  constructor(props) {
    super(props);

    const { translation, transliteration } = this.props.item;

    this.savedData = {
      translation,
      transliteration
    };

    this.state = {
      ...this.state,
      disabled: true,
      error: false,
    };
  }

  handleTranslationChange = (e) => {
    const newTranslation = e.target.value.trim();
    this.setState({
      translation: newTranslation,
      disabled: newTranslation === this.savedData.translation,
    });
  }

  handleTransliterationChange = (e) => {
    const newTransliteration = e.target.value.trim();
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
      const { english_word, sound_link, translation,
        transliteration } = this.state;

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
      await fetch(`${ApiUtils.origin}${ApiUtils.path}addTranslations`, {
        method: 'POST',
        body: JSON.stringify({
          english_word,
          sound_link,
          translation,
          transliteration,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      });

      this.savedData = {
        translation,
        transliteration
      };

      await this.showPopup('Saved!');

      this.setState({
        disabled: true,
      });
    } catch(err) {
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
      });
      return await res.text();
    } catch(err) {
      console.error(err);
    }
  }

  renderEndOfRow() {
    return [
      <Button
        variant="contained"
        color="primary"
        disabled={this.state.disabled}
        onClick={() => this.saveTranslation_()}
        key={0}
        className="save-button"
      >
        Save
      </Button>
    ];
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
