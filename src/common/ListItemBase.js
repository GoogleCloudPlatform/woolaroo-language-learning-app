import React from 'react';
import AudioRecorder from '../audio/AudioRecorder';
import ApiUtils from '../utils/ApiUtils';
import AuthUtils from '../utils/AuthUtils';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import './ListItemBase.css';

class ListItemBase extends React.Component {
  constructor(props) {
    super(props);

    this.handleClose_ = this.handleClose_.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.handleDialogClose_ = this.handleDialogClose_.bind(this);
    this.handleDeleteConfirm_ = this.handleDeleteConfirm_.bind(this);
    this.showDeleteConfirm_ = this.showDeleteConfirm_.bind(this);

    const {
      english_word, primary_word, id, frequency,
      sound_link, translation, transliteration,
      // For flagged items only.
      curr_sound_link, curr_translation, curr_transliteration, content,
    } = this.props.item;

    this.state = {
      id,
      english_word,
      primary_word,
      sound_link,
      translation,
      transliteration,
      frequency,
      content,
      curr_sound_link,
      curr_translation,
      curr_transliteration,
      promo_message: null,
      promo_open: false,
      deleted: false,
      showDeleteConfirm: false,
      collectionName: '',
    };
  }

  async showPopup(message) {
    await this.setState({promo_message: message, promo_open: true})
  }

  showDeleteConfirm_() {
    this.setState({
      showDeleteConfirm: true,
    });
  }

  handleTranslationChange = (e) => {
    const newTranslation = e.target.value;
    this.setState({
      translation: newTranslation,
    });
  }

  handleTransliterationChange = (e) => {
    const newTransliteration = e.target.value;
    this.setState({
      transliteration: newTransliteration,
    });
  }

  deleteItem = async (e) => {
    try {
      const { id, collectionName } = this.state;

      await fetch(`${ApiUtils.origin}${ApiUtils.path}deleteRow`, {
        method: 'DELETE',
        body: JSON.stringify({
          id,
          collectionName,
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': await AuthUtils.getAuthHeader(),
        }
      });

      this.setState({
        deleted: true,
      });
    } catch(err) {
      console.error(err);
    }
  }

  renderBaseWord() {

    if (AuthUtils.getPrimaryLanguage()==="English"){
        return (
          <Tooltip title={this.state.english_word} placement="bottom">
            <div className="base-word">
              {this.state.english_word}
            </div>
          </Tooltip>
        );
    }else{
        const primary_word = (!this.state.primary_word || this.state.primary_word==="")?this.state.english_word:this.state.primary_word;
        return (
          <Tooltip title={primary_word} placement="bottom">
            <div className="base-word">{primary_word}
              <div className="english-word-small">{this.state.english_word} </div>
            </div>
          </Tooltip>
        );
    }
  }




  renderPrimaryWord() {
    //placeholder for TranslationItemBase to overwrite
    return;
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

  renderPromoMessage() {
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

  handleDeleteConfirm_(e) {
    e && e.stopPropagation();
    this.setState({showDeleteConfirm: false, deleted: true});
    this.deleteItem();
  }

  handleDialogClose_() {
    this.setState({showDeleteConfirm: false});
  }

  renderDeleteConfirmAlert() {
    if (!this.state.showDeleteConfirm) {
      return;
    }

    return (
      <Dialog open onClose={this.handleDialogClose_}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will delete this word and all data associated with it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleDialogClose_} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleDeleteConfirm_} color="primary" autoFocus
            className="delete-confirm">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    if (this.state.deleted) {
      return null;
    }

    return (
      <li className="translation-list-item">
        {this.renderBaseWord()}
        {this.renderPrimaryWord()}
        {this.renderTranslation()}
        {this.renderTransliteration()}
        {this.renderAudioRecorder()}
        {this.renderEndOfRow()}
        {this.renderPromoMessage()}
        {this.renderDeleteConfirmAlert()}
      </li>
    );
  }
}

export default ListItemBase;
