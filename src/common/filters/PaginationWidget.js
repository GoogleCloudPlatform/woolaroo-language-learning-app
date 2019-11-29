import React from 'react';
import './PaginationWidget.css';

class PaginationWidget extends React.Component {
  handleClick_(e, nextPageNum) {
    e.preventDefault();

    this.props.updatePageNum(nextPageNum);
  }

  renderPageNums_() {
    const pageNums = [];
    const minPage = Math.max(1, this.props.pageNum - 2);

    for (let pageNum = minPage; pageNum < minPage + 5; pageNum++) {
      if (pageNum > this.props.pageNum && this.props.lastPage) {
        return pageNums;
      }
      pageNums.push(
        <li key={pageNum}>
          <button
            onClick={(e) => this.handleClick_(e, pageNum)}
            className={this.props.pageNum === pageNum ? 'selected' : null}
          >
            {pageNum}
          </button>
        </li>
      );
    }

    return pageNums;
  }

  renderNextArrows_() {
    if (this.props.lastPage) {
      return null;
    }

    return [
      <li key="next-1">
        <button
          onClick={(e) => this.handleClick_(e, Math.max(1, this.props.pageNum + 1))}
        >
          {">"}
        </button>
      </li>,
      <li key="next-2">
        <button
          onClick={(e) => this.handleClick_(e, Math.max(1, this.props.pageNum + 5))}
        >
          {">>"}
        </button>
      </li>
    ];
  }

  render() {
    return (
      <div className="pagination-widget">
        <ul className="page-numbers">
          <li>
            <button
              onClick={(e) => this.handleClick_(e, Math.max(1, this.props.pageNum - 5))}
            >
              {"<<"}
            </button>
          </li>
          <li>
            <button
              onClick={(e) => this.handleClick_(e, Math.max(1, this.props.pageNum - 1))}
            >
              {"<"}
            </button>
          </li>
          {this.renderPageNums_()}
          {this.renderNextArrows_()}

        </ul>
      </div>
    );
  }
}

export default PaginationWidget;
