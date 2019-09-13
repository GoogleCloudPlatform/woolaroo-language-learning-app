import React from 'react';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import PlayIcon from '@material-ui/icons/PlayArrowOutlined';
import ApiUtils from '../utils/ApiUtils';
import './TranslationListItem.css';

class TranslationListItem extends React.Component {
  constructor(props) {
    super(props);

    this.handleTranslationChange_ = this.handleTranslationChange_.bind(this);
    this.handleTransliterationChange_ = this.handleTransliterationChange_
      .bind(this);
    this.saveTranslation_ = this.saveTranslation_.bind(this);

    const { english_word, sound_link, translation,
      transliteration } = this.props.translation;
    this.state = {
      english_word,
      sound_link,
      translation,
      transliteration,
      translation_saved: false,
    };
  }

  handleTranslationChange_(e) {
    this.setState({ translation: e.target.value });
  }

  handleTransliterationChange_(e) {
    this.setState({ transliteration: e.target.value });
  }

  saveTranslation_(e) {
    const { english_word, sound_link, translation,
      transliteration } = this.state;

    fetch(`${ApiUtils.origin}${ApiUtils.path}addTranslations`, {
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
    })
    .then(resp => resp.json())
    .then((resp) => {
      this.setState({
        // todo(parikhshiv) - waiting on design to decide how to inform user
        // of this
        translation_saved: true,
      })
    })
    .catch((err) => {
      console.error(err);
    });
  }

  render() {
    const {english_word, translation, transliteration} = this.state;

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
          onBlur={this.saveTranslation_}
        />
        <TextField
          value={transliteration}
          label="Transliteration"
          variant="outlined"
          margin="normal"
          onChange={this.handleTransliterationChange_}
          onBlur={this.saveTranslation_}
        />
        <Fab color="primary" aria-label="record">
          <PlayIcon />
        </Fab>
      </li>
    );
  }
}

export default TranslationListItem;
