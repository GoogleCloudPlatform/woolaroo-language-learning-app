import ListPageBase from '../common/ListPageBase'
import TranslationListItem from './TranslationListItem';
import './TranslationsPage.css';

class TranslationsPage extends ListPageBase {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      list_item_tag: TranslationListItem,
      collectionName: 'translations',
    };
  }
}

export default TranslationsPage;
