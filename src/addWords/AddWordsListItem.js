import React from "react";
import TranslationListItem from "../translations/TranslationListItem";
import "./AddWordsListItem.scss";
import TextField from "@material-ui/core/TextField";
import AuthUtils from "../utils/AuthUtils";
import AudioRecorder from "../audio/AudioRecorder";

class AddWordsListItem extends TranslationListItem {
  constructor(props) {
    super(props);

    const { english_word, primary_word } = this.props.item;

    this.savedData = {
      ...this.savedData,
      english_word,
      primary_word
    };

    this.state = {
      ...this.state,
      disabled: true,
      error: false
    };
  }

  handleBaseWordChange = e => {
    const newBaseWord = e.target.value;
    if (AuthUtils.getPrimaryLanguage() === "English") {
      //also update primary_word as the same word since there is no primary_word input field for English
      this.setState({
        english_word: newBaseWord,
        primary_word: newBaseWord,
        disabled:
          this.alwaysDisabled_({ newBaseWord }) ||
          newBaseWord === this.savedData.english_word
      });
    } else {
      this.setState({
        english_word: newBaseWord,
        disabled:
          this.alwaysDisabled_({ newBaseWord }) ||
          newBaseWord === this.savedData.english_word
      });
    }
  };

  handlePrimaryWordChange = e => {
    const newPrimaryWord = e.target.value;
    this.setState({
      primary_word: newPrimaryWord,
      disabled:
        this.alwaysDisabled_({ newPrimaryWord }) ||
        newPrimaryWord === this.savedData.primary_word
    });
  };

  handleTranslationChange = e => {
    const newTranslation = e.target.value;
    this.setState({
      translation: newTranslation,
      disabled:
        this.alwaysDisabled_({ newTranslation }) ||
        newTranslation === this.savedData.translation
    });
  };

  handleTransliterationChange = e => {
    const newTransliteration = e.target.value;
    this.setState({
      transliteration: newTransliteration,
      disabled:
        this.alwaysDisabled_() ||
        newTransliteration === this.savedData.transliteration
    });
  };

  actionaftersaving() {
    //overwrites actionaftersaving() from TranslationListItem
    this.setState({
      deleted: true
    });
  }
  deleteItem_ = async e => {
    try {
      this.setState({
        deleted: true
      });
    } catch (err) {
      console.error(err);
    }
  };

  onSavedAudio(e) {
    console.log("onSavedAudio_", e);
    this.setState({
      sound_blob: e.data,
      disabled: this.alwaysDisabled_()
    });
  }

  alwaysDisabled_(opts = {}) {
    return !(
      (opts.newBaseWord || this.state.english_word) &&
      (opts.newTranslation || this.state.translation) &&
      (opts.newPrimaryWord || this.state.primary_word)
    );
  }

   //Overriding method here as the order is changed and 
   //we are using primary word to render english translation
   //[Done to conform to the layout in the render() of ListItemBase]
  renderTranslation() {
    return null
  }

   //Overriding method here for custom styling for add word page
  //This method provides the endangered language text
  renderBaseWord() {
    //Here the base word is the foriegn language translation
    return (
      <div className="translation-text">
        <TextField
          label="Word"
          variant="outlined"
          margin="normal"
        />
      </div>
    );
  }

  //Overriding method here for custom styling for add word page
  //This method provides the transiteration text
  renderTransliteration() {
    return (
      <div className="add-word-transliteration">
        <TextField
          label="Transliteration"
          variant="outlined"
          margin="normal"
          className="transliteration-text-field"
        />
      </div>
    );
  }

  //Overriding method here for custom styling for add word page
  renderAudioRecorder() {
    return (
      <AudioRecorder
        classPreference="add-word-audio-buttons"
        audioUrl={this.state.sound_link}
        onSavedAudio={blob => this.onSavedAudio(blob)}
        key={0}
      />
    );
  }

  //Overriding method here for custom styling for add word page
  //This method provides the english translation text
  renderPrimaryWord() {
    return (
      <div className="add-word-english-translation">
        <TextField
          label="Translations"
          variant="outlined"
          margin="normal"
          className="english-word-text-field"
        />
      </div>
    );

    // if (AuthUtils.getPrimaryLanguage()==="English"){
    //     return;
    // }else{
    //     const label = `Word in ${AuthUtils.getPrimaryLanguage()}`;
    //     return (
    //       <TextField
    //         value={this.state.primary_word}
    //         label={label}
    //         variant="outlined"
    //         margin="normal"
    //         onChange={this.handlePrimaryWordChange}
    //         className="primary-word-text-field"
    //       />
    //     );
    // }
  }

  renderEndOfRow() {
    // To be overridden.
    return null;
  }
}

export default AddWordsListItem;
