import React from 'react';
import ListPageBase from '../common/ListPageBase';
import PaginationWidget from '../common/filters/PaginationWidget';
import StateSelection from '../common/filters/StateSelection';
import FilterChips from '../common/filters/FilterChips';
import TranslationListItem from './TranslationListItem';
import { withRouter } from 'react-router-dom';
import './TranslationsPage.css';

class TranslationsPage extends ListPageBase {
  constructor(props) {
    super(props);

    this.updatePageNum = this.updatePageNum.bind(this);
    this.updateCompleteState = this.updateCompleteState.bind(this);
    this.updateNeedsRecording = this.updateNeedsRecording.bind(this);

    const queryStringParams = new URLSearchParams(props.location.search);
    const needsRecording = queryStringParams.get('needsRecording');
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
      needsRecording: !!(needsRecording && needsRecording !== '0'),
      pageNum: pageNum || 1,
      search: queryStringParams.get('search'),
    };
  }

  async componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      const queryStringParams = new URLSearchParams(this.props.location.search);
      const newSearch = queryStringParams.get('search') || '';
      if (newSearch !== this.state.search) {
        await this.setState({search: newSearch});
        await this.fetchItems();
      }
    }
  }

  async updateCompleteState(nextCompleteState) {
    let nextHistory = `/translations/1?state=${this.state.needsRecording ? '1' : '0'}`;
    if (nextCompleteState) {
      nextHistory += `&state=${nextCompleteState}`;
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

  async updateNeedsRecording(nextNeedsRecording) {
    let nextHistory = `/translations/1?state=${this.state.completeState || 'all'}`;
    if (nextNeedsRecording) {
      nextHistory += `&needsRecording=1`;
    }
    this.props.history.push(nextHistory);
    await this.setState({needsRecording: nextNeedsRecording, loading: true, pageNum: 1});
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
        lastPage={this.state.items.length < this.state.pageSize}
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

  renderFilterChips_() {
    return (
      <FilterChips
        needsRecording={this.state.needsRecording}
        updateNeedsRecording={this.updateNeedsRecording}
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
        {this.renderFilterChips_()}
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
