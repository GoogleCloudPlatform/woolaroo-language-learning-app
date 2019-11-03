import React from 'react';
import TextField from '@material-ui/core/TextField';
import AudioRecorder from '../audio/AudioRecorder';
import Snackbar from '@material-ui/core/Snackbar';
import './ListItemBase.css';

class ListItemBase extends React.Component {
  constructor(props) {
    super(props);

    this.handleClose_ = this.handleClose_.bind(this);

    const { english_word, sound_link, translation,
      transliteration, id, frequency } = this.props.item;

    this.state = {
      id,
      english_word,
      sound_link,
      translation,
      transliteration,
      frequency,
      promo_message: null,
      promo_open: false,
    };
  }

  async showPopup(message) {
    await this.setState({promo_message: message, promo_open: true})
  }

  handleTranslationChange = (e) => {
    const newTranslation = e.target.value.trim();
    this.setState({
      translation: newTranslation,
    });
  }

  handleTransliterationChange = (e) => {
    const newTransliteration = e.target.value.trim();
    this.setState({
      transliteration: newTransliteration,
    });
  }

  renderBaseWord() {
    return (
      <div className="base-word">
        {this.state.english_word}
      </div>
    );
  }

  renderTranslation() {
    return (
      <TextField
        value={this.state.translation}
        label="Translation"
        variant="outlined"
        margin="normal"
        onChange={this.handleTranslationChange}
        className="translation-text-field"
      />
    );
  }

  renderTransliteration() {
    return (
      <TextField
        value={this.state.transliteration}
        label="Transliteration"
        variant="outlined"
        margin="normal"
        onChange={this.handleTransliterationChange}
        className="transliteration-text-field"
      />
    );
  }

  onSavedAudio(e) {
    console.log('onSavedAudio_', e);
    this.setState({sound_blob: e.data, disabled: false});
  }

  renderAudioRecorder() {
    return (
      <AudioRecorder
        audioUrl={this.state.sound_link}
        onSavedAudio={(blob) => this.onSavedAudio(blob)}
        key={0}
      />
    );
  }

  renderEndOfRow() {
    // To be overridden.
    return null;
  }

  handleClose_() {
    this.setState({promo_open: false});
  }

  renderPromoMessage_() {
    if (!this.state.promo_message || !this.state.promo_open) {
      return null;
    }

    return (
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        message={<span id="message-id">{this.state.promo_message}</span>}
        onClose={this.handleClose_}
        open
      />
    );
  }

  render() {
    return (
      <li className="translation-list-item">
        {this.renderBaseWord()}
        {this.renderTranslation()}
        {this.renderTransliteration()}
        {this.renderAudioRecorder()}
        {this.renderEndOfRow()}
        {this.renderPromoMessage_()}
      </li>
    );
  }
}

export default ListItemBase;
