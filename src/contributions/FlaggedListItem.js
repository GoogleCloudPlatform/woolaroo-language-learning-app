import React from 'react';
import AudioRecorder from '../audio/AudioRecorder';
import ContributionListItem from './ContributionListItem';
import Grid from '@material-ui/core/Grid';
import WarningIcon from '@material-ui/icons/Warning';
import './ContributionListItem.css';
import './FlaggedListItem.css';

class FlaggedListItem extends ContributionListItem {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      collectionName: 'feedback',
    }
  }

  getFlaggedTypeStr_() {
    if (this.state.types.length === 2) {
      return 'Marked as incorrect and offensive';
    }
    if (this.state.types.includes('IncorrectTranslation')) {
      return 'Marked as incorrect';
    }
    if (this.state.types.includes('OffensiveTranslation')) {
      return 'Marked as offensive';
    }
    // Shouldn't actually happen.
    return 'Marked for unknown reason'
  }

  render() {
    if (this.state.deleted) {
      return null;
    }
    const emptyTranslation = <div className='empty-field'>No existing translation</div>;
    const emptyTransliteration = <div className='empty-field'>No existing transliteration</div>;

    return (
      <li className='flagged-list-item'>
        <div className='flagged-reason'>
          <WarningIcon className='warning-icon' />
          {this.getFlaggedTypeStr_()}: "{this.state.content}"
        </div>
        <div className="translation-list-item">
          <Grid container spacing={1} direction='column'>
            <Grid container item xs={12} spacing={0} alignItems='center'>
              <React.Fragment>
                <Grid item xs={2}>
                  <div>{this.renderBaseWord()}</div>
                </Grid>
                <Grid item xs={3} className='current-saved-value'>
                  {this.state.curr_translation || emptyTranslation}
                </Grid>
                <Grid item xs={3} className='current-saved-value'>
                  {this.state.curr_transliteration || emptyTransliteration}
                </Grid>
                <Grid item xs={1}>
                  <AudioRecorder
                    audioUrl={this.state.curr_sound_link}
                    disableRecord={true}
                    key={0}
                  />
                </Grid>
                <Grid item xs={3} />
              </React.Fragment>
            </Grid>
            <Grid container item xs={12} spacing={0} alignItems='center'>
              <React.Fragment>
                <Grid item xs={2} />
                <Grid item xs={3}>
                  {this.renderTranslation()}
                </Grid>
                <Grid item xs={3}>
                  {this.renderTransliteration()}
                </Grid>
                <Grid item xs={2}>
                  {this.renderAudioRecorder()}
                </Grid>
                <Grid item xs={2}>
                  {this.renderEndOfRow()}
                </Grid>
              </React.Fragment>
            </Grid>
          </Grid>
        </div>
        {this.renderPromoMessage()}
        {this.renderDeleteConfirmAlert()}
      </li>
    );
  }
}

export default FlaggedListItem;
