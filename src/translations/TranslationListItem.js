import React from 'react';
import ListItemBase from '../common/ListItemBase'
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import PlayIcon from '@material-ui/icons/PlayArrowOutlined';
import ApiUtils from '../utils/ApiUtils';
import './TranslationListItem.css';

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

  renderEndOfRow() {
    return [
      <Fab aria-label="record" key={0}>
        <PlayIcon />
      </Fab>,
      <Button
        variant="contained"
        color="primary"
        disabled={this.state.disabled}
        onClick={this.saveTranslation_}
        key={1}
      >
        Save
      </Button>
    ];
  }
}

export default TranslationListItem;
