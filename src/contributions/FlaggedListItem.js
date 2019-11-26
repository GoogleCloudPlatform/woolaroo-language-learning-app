import React from 'react';
import ContributionListItem from './ContributionListItem';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Done';
import ApiUtils from '../utils/ApiUtils';
import AuthUtils from '../utils/AuthUtils';
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

  renderEndOfRow() {
    return [
      <IconButton
        aria-label="save"
        className="save-contribution"
        key={0}
        onClick={this.saveContribution_}
      >
        <SaveIcon />
      </IconButton>,
      <IconButton
        aria-label="delete"
        className="delete-contribution"
        key={1}
        onClick={this.showDeleteConfirm_}
      >
        <DeleteIcon />
      </IconButton>,
    ];
  }

  render() {
    if (this.state.deleted) {
      return null;
    }

    return super.render();
  }
}

export default FlaggedListItem;
