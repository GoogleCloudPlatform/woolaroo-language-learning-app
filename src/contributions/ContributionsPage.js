import ListPageBase from '../common/ListPageBase'
import ContributionListItem from './ContributionListItem';
import './ContributionsPage.css';

class ContributionsPage extends ListPageBase {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      listItemTag: ContributionListItem,
      collectionName: 'suggestions',
      pageTitle: 'User Contributions'
    };
  }
}

export default ContributionsPage;
