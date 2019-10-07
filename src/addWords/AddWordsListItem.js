import React from 'react';
// import Button from '@material-ui/core/Button';
import TranslationListItem from '../translations/TranslationListItem'
// import ApiUtils from '../utils/ApiUtils';
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
      disabled: newBaseWord === this.savedData.english_word,
    });
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
