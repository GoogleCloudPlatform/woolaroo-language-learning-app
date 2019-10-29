import React from 'react';
import TranslationListItem from '../translations/TranslationListItem'
import './AddWordsListItem.css';
import TextField from '@material-ui/core/TextField';

class AddWordsListItem extends TranslationListItem {
  constructor(props) {
    super(props);

    const { english_word } = this.props.item;

    this.savedData = {
      ...this.savedData,
      english_word,
    };

    this.state = {
      ...this.state,
      disabled: true,
      error: false,
    };
  }

  handleBaseWordChange = (e) => {
    const newBaseWord = e.target.value.trim();
    this.setState({
      english_word: newBaseWord,
      disabled: this.alwaysDisabled_({newBaseWord}) || newBaseWord === this.savedData.english_word,
    });
  }

  handleTranslationChange = (e) => {
    const newTranslation = e.target.value.trim();
    this.setState({
      translation: newTranslation,
      disabled: this.alwaysDisabled_({newTranslation}) || newTranslation === this.savedData.translation,
    });
  }

  handleTransliterationChange = (e) => {
    const newTransliteration = e.target.value.trim();
    this.setState({
      transliteration: newTransliteration,
      disabled: this.alwaysDisabled_() || newTransliteration === this.savedData.transliteration,
    });
  }

  onSavedAudio(e) {
    console.log('onSavedAudio_', e);
    this.setState({
      sound_blob: e.data,
      disabled: this.alwaysDisabled_(),
    });
  }

  alwaysDisabled_(opts = {}) {
    return !((opts.newBaseWord || this.state.english_word) && (opts.newTranslation || this.state.translation));
  }

  renderBaseWord() {
    return (
      <TextField
        value={this.state.english_word}
        label="English Word"
        variant="outlined"
        margin="normal"
        onChange={this.handleBaseWordChange}
        className="english-word-text-field"
      />
    );
  }
}

export default AddWordsListItem;
