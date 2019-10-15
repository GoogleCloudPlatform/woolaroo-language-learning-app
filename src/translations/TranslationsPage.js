import React from 'react';
import ListPageBase from '../common/ListPageBase';
import PaginationWidget from '../common/PaginationWidget';
import StateSelection from '../common/StateSelection';
import TranslationListItem from './TranslationListItem';
import { withRouter } from 'react-router-dom';
import './TranslationsPage.css';

class TranslationsPage extends ListPageBase {
  constructor(props) {
    super(props);

    this.updatePageNum = this.updatePageNum.bind(this);
    this.updateCompleteState = this.updateCompleteState.bind(this);

    const queryStringParams = new URLSearchParams(props.location.search);
    let pageNum;
    if (props.match && props.match.params) {
      pageNum = +props.match.params.pageNum;
    }

    this.state = {
      ...this.state,
      listItemTag: TranslationListItem,
      collectionName: 'translations',
      pageSize: 25,
      completeState: queryStringParams.get('state'),
      pageNum: pageNum || 1,
    };
  }

  async updateCompleteState(nextCompleteState) {
    let nextHistory = `/translations/1`;
    if (nextCompleteState) {
      nextHistory += `?state=${nextCompleteState}`;
    }
    this.props.history.push(nextHistory);
    await this.setState({completeState: nextCompleteState, loading: true, pageNum: 1});
    await this.fetchItems();
  }

  async updatePageNum(nextPageNum) {
    this.props.history.push(`/translations/${nextPageNum}${this.props.location.search}`);
    await this.setState({pageNum: nextPageNum, loading: true});
    await this.fetchItems();
  }

  renderPaginationWidget_() {
    if (this.state.items.length < this.state.pageSize && this.state.pageNum === 1) {
      return null;
    }

    return (
      <PaginationWidget
        pageNum={this.state.pageNum}
        updatePageNum={this.updatePageNum}
      />
    );
  }

  renderStateSelection_() {
    return (
      <StateSelection
        completeState={this.state.completeState}
        updateCompleteState={this.updateCompleteState}
      />
    );
  }

  renderItems() {
    return (
      <div>
        {super.renderItems()}
        {this.renderPaginationWidget_()}
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderStateSelection_()}
        {this.state.loading ? <div>Loading...</div> : this.renderItems()}
      </div>
    );
  }
}

const TranslationsPageWithRouter = withRouter(TranslationsPage);

export {
  TranslationsPageWithRouter,
  TranslationsPage,
};
