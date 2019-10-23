import React from 'react';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import './FilterChips.css';

class FilterChips extends React.Component {
  handleClick_(needsRecording) {
    this.props.updateNeedsRecording(needsRecording);
  }

  render() {
    const otherProps = {};
    if (this.props.needsRecording) {
      otherProps.color = "primary"
    }

    return (
      <div className="filter-chips">
        <Chip
          icon={this.props.needsRecording ? <DoneIcon /> : null}
          label="Needs Recording"
          clickable
          onClick={() => { this.handleClick_(!this.props.needsRecording) }}
          className="filter-chip recording-chip"
          {...otherProps}
        />
      </div>
    );
  }
}

export default FilterChips;
