import React from 'react';
import ListPageBase from '../common/ListPageBase';
import PaginationWidget from '../common/PaginationWidget';
import TranslationListItem from './TranslationListItem';
import { withRouter } from 'react-router-dom';
import './TranslationsPage.css';

class TranslationsPage extends ListPageBase {
  constructor(props) {
    super(props);

    this.updatePageNum = this.updatePageNum.bind(this);

    this.state = {
      ...this.state,
      listItemTag: TranslationListItem,
      collectionName: 'translations',
      pageSize: 25,
    };

    if (props.match && props.match.params) {
      this.state.pageNum = +props.match.params.pageNum || 1;
    }
  }

  async updatePageNum(nextPageNum) {
    this.props.history.push(`/translations/${nextPageNum}`);
    await this.setState({pageNum: nextPageNum, loading: true});
    await this.fetchItems();
  }

  renderItems() {
    return (
      <div>
        {super.renderItems()}
        <PaginationWidget
          pageNum={this.state.pageNum}
          updatePageNum={this.updatePageNum}
        />
      </div>
    )
  }
}

export default withRouter(TranslationsPage);
