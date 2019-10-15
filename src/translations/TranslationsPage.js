import React from 'react';
import ListPageBase from '../common/ListPageBase';
import PaginationWidget from '../common/PaginationWidget';
import TranslationListItem from './TranslationListItem';
import './TranslationsPage.css';

class TranslationsPage extends ListPageBase {
  constructor(props) {
    super(props);

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

  renderItems() {
    return (
      <div>
        {super.renderItems()}
        <PaginationWidget pageNum={this.state.pageNum}/>
      </div>
    )
  }
}

export default TranslationsPage;
