import React from 'react';
import TranslationListItem from '../translations/TranslationListItem'
import './AddWordsListItem.css';
import TextField from '@material-ui/core/TextField';
import AuthUtils from '../utils/AuthUtils';

class AddWordsListItem extends TranslationListItem {
  constructor(props) {
    super(props);

    const { english_word, primary_word } = this.props.item;

    this.savedData = {
      ...this.savedData,
      english_word,
      primary_word,
    };

    this.state = {
      ...this.state,
      disabled: true,
      error: false,
    };
  }

  handleBaseWordChange = (e) => {
    const newBaseWord = e.target.value;
    if (AuthUtils.getPrimaryLanguage()==="English"){
        //also update primary_word as the same word since there is no primary_word input field for English
        this.setState({
          english_word: newBaseWord,
          primary_word: newBaseWord,
          disabled: this.alwaysDisabled_({newBaseWord}) || newBaseWord === this.savedData.english_word,
        });
    }else{
        this.setState({
          english_word: newBaseWord,
          disabled: this.alwaysDisabled_({newBaseWord}) || newBaseWord === this.savedData.english_word,
        });
    }
  }
  
  handlePrimaryWordChange = (e) => {
    const newPrimaryWord = e.target.value;
    this.setState({
      primary_word: newPrimaryWord,
      disabled: this.alwaysDisabled_({newPrimaryWord}) || newPrimaryWord === this.savedData.primary_word,
    });
  }

  handleTranslationChange = (e) => {
    const newTranslation = e.target.value;
    this.setState({
      translation: newTranslation,
      disabled: this.alwaysDisabled_({newTranslation}) || newTranslation === this.savedData.translation,
    });
  }

  handleTransliterationChange = (e) => {
    const newTransliteration = e.target.value;
    this.setState({
      transliteration: newTransliteration,
      disabled: this.alwaysDisabled_() || newTransliteration === this.savedData.transliteration,
    });
  }
  
  actionaftersaving(){
    //overwrites actionaftersaving() from TranslationListItem
    console.log("Saving Completed");
    
    this.setState({
      deleted: true,
    });
  }
  deleteItem_ = async (e) => {
    try {
      
      this.setState({
        deleted: true,
      });
    } catch(err) {
      console.error(err);
    }
  }

  onSavedAudio(e) {
    console.log('onSavedAudio_', e);
    this.setState({
      sound_blob: e.data,
      disabled: this.alwaysDisabled_(),
    });
  }

  alwaysDisabled_(opts = {}) {
    return !((opts.newBaseWord || this.state.english_word) && (opts.newTranslation || this.state.translation) && (opts.newPrimaryWord || this.state.primary_word));
  }

  renderBaseWord() {
    return (
      <TextField
        value={this.state.english_word}
        label="Word in English"
        variant="outlined"
        margin="normal"
        onChange={this.handleBaseWordChange}
        className="english-word-text-field"
      />
    );
  }
  renderPrimaryWord() {
  
    if (AuthUtils.getPrimaryLanguage()==="English"){
        return ;
    }else{
        const label = "Word in "+AuthUtils.getPrimaryLanguage()+"";
        return (
          <TextField
            value={this.state.primary_word}
            label={label}
            variant="outlined"
            margin="normal"
            onChange={this.handlePrimaryWordChange}
            className="primary-word-text-field"
          />
        );
    }
  }
}

export default AddWordsListItem;
