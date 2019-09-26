import ListPageBase from '../common/ListPageBase'
import ContributionListItem from './ContributionListItem';
import './ContributionsPage.css';

class ContributionsPage extends ListPageBase {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      list_item_tag: ContributionListItem,
      collectionName: 'suggestions',
    };
  }
}

export default ContributionsPage;
