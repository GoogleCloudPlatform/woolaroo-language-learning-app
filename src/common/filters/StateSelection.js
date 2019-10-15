import React from 'react';
import './StateSelection.css';

class StateSelection extends React.Component {
  handleClick_(e, nextCompleteState) {
    e.preventDefault();

    this.props.updateCompleteState(nextCompleteState);
  }

  render() {
    const { completeState } = this.props;

    return (
      <div className="state-selection">
        <ul>
          <li
            className={!completeState || completeState === 'all' ? 'selected' : null}
            onClick={(e) => this.handleClick_(e, null)}
          >
            <a href='#'>All</a>
          </li>
          <li
            className={completeState === 'incomplete' ? 'selected' : null}
            onClick={(e) => this.handleClick_(e, 'incomplete')}
          >
            <a href='#'>Incomplete</a>
          </li>
          <li
            className={completeState === 'complete' ? 'selected' : null}
            onClick={(e) => this.handleClick_(e, 'complete')}
          >
            <a href='#'>Complete</a>
          </li>
        </ul>
      </div>
    );
  }
}

export default StateSelection;
