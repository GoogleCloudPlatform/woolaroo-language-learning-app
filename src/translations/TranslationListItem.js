import React from 'react';
import Button from '@material-ui/core/Button';
import ListItemBase from '../common/ListItemBase'
import ApiUtils from '../utils/ApiUtils';
import './TranslationListItem.css';
import AudioRecorder from '../audio/AudioRecorder';

class TranslationListItem extends ListItemBase {
  constructor(props) {
    super(props);

    const { translation, transliteration } = this.props.item;

    this.saved_data = {
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
      disabled: newTranslation === this.saved_data.translation,
    });
  }

  handleTransliterationChange = (e) => {
    const newTransliteration = e.target.value.trim();
    this.setState({
      transliteration: newTransliteration,
      disabled: newTransliteration === this.saved_data.transliteration,
    });
  }

  saveTranslation_ = async (e) => {
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

      // TODO(smus): Upload this blob of audio to a Cloud storage and get the
      // uploaded file's URL.
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

      this.saved_data = {
        translation,
        transliteration
      };

      this.setState({
        disabled: true,
      });
    } catch(err) {
      console.error(err);
    }
  }

  onSavedAudio_(blob) {
    console.log('onSavedAudio_', blob);
    this.setState({sound_blob: blob});
  }

  renderEndOfRow() {
    return [<AudioRecorder audioUrl={this.state.sound_link}
      onSavedAudio={(blob) => this.onSavedAudio_(blob)}
      key={0} />,
      <Button
        variant="contained"
        color="primary"
        onClick={() => this.saveTranslation_()}
        key={1}
      >
        Save
      </Button>
    ];
  }
}

export default TranslationListItem;
