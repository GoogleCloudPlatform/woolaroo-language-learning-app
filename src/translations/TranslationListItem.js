import React from 'react';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import PlayIcon from '@material-ui/icons/PlayArrowOutlined';
import ApiUtils from '../utils/ApiUtils';
import './TranslationListItem.css';

class TranslationListItem extends React.Component {
  constructor(props) {
    super(props);

    const { english_word, sound_link, translation,
      transliteration } = this.props.translation;

    this.saved_data = {
      translation,
      transliteration
    };

    this.state = {
      english_word,
      sound_link,
      translation,
      transliteration,
      disabled: true,
      translation_saved: false,
    };
  }

  handleTranslationChange_ = (e) => {
    const newTranslation = e.target.value.trim();
    this.setState({
      translation: newTranslation,
      disabled: newTranslation === this.saved_data.translation,
    });
  }

  handleTransliterationChange_ = (e) => {
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

  render() {
    const {english_word, translation, transliteration, disabled} = this.state;

    return (
      <li className="translation-list-item">
        <div className="base-word">
          {english_word}
        </div>
        <TextField
          value={translation}
          label="Translation"
          variant="outlined"
          margin="normal"
          onChange={this.handleTranslationChange_}
        />
        <TextField
          value={transliteration}
          label="Transliteration"
          variant="outlined"
          margin="normal"
          onChange={this.handleTransliterationChange_}
        />
        <Fab aria-label="record">
          <PlayIcon />
        </Fab>
        <Button
          variant="contained"
          color="primary"
          disabled={disabled}
          onClick={this.saveTranslation_}
        >
          Save
        </Button>
      </li>
    );
  }
}

export default TranslationListItem;
