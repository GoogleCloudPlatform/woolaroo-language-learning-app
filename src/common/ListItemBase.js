import React from 'react';
import TextField from '@material-ui/core/TextField';
import './ListItemBase.css';

class ListItemBase extends React.Component {
  constructor(props) {
    super(props);

    const { english_word, sound_link, translation,
      transliteration, id } = this.props.item;

    this.state = {
      id,
      english_word,
      sound_link,
      translation,
      transliteration,
    };
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

  renderEndOfRow() {
    // To be overridden.
    return null;
  }

  render() {
    return (
      <li className="translation-list-item">
        {this.renderBaseWord()}
        {this.renderTranslation()}
        {this.renderTransliteration()}
        {this.renderEndOfRow()}
      </li>
    );
  }
}

export default ListItemBase;
