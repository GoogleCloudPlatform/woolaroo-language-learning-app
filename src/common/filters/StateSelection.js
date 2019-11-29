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
            <button>All</button>
          </li>
          <li
            className={completeState === 'incomplete' ? 'selected' : null}
            onClick={(e) => this.handleClick_(e, 'incomplete')}
          >
            <button>Incomplete</button>
          </li>
          <li
            className={completeState === 'complete' ? 'selected' : null}
            onClick={(e) => this.handleClick_(e, 'complete')}
          >
            <button>Complete</button>
          </li>
        </ul>
      </div>
    );
  }
}

export default StateSelection;
