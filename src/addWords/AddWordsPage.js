import React from 'react';
import ListPageBase from '../common/ListPageBase';
import AddWordsListItem from './AddWordsListItem';
import Button from '@material-ui/core/Button';
import './AddWordsPage.css';

const BASE_NUM_ROWS = 10;

class AddWordsPage extends ListPageBase {
  constructor(props) {
    super(props);

    this.individualWordsContainer_ = React.createRef();

    this.state = {
      ...this.state,
      loading: false,
      listItemTag: AddWordsListItem,
      items: [...this.state.items, ...this.getEmptyItems_()],
    };
  }

  getEmptyItems_() {
    const items = [];

    for (let i = 0; i < BASE_NUM_ROWS; i++) {
      items.push({
        id: this.state.items.length + i,
        english_word: '',
        sound_link: '',
        translation: '',
        transliteration: '',
      });
    }

    return items;
  }

  addRows_() {
    this.setState({
      items: [...this.state.items, ...this.getEmptyItems_()]
    });
  }

  renderBulkUpload_() {
    return null;
    // todo(parikhshiv): implement bulk upload
    // return (
    //   <div>
    //     <span>
    //       Contribute to the app by adding new words and their translations.
    //       You can either upload words in bulk from a Google Sheet or .csv file,
    //       or add them in one by one below.
    //     </span>
    //     <h2>Bulk upload</h2>
    //     <span>
    //       Format your file so that the column headers are Word, English
    //       translation, Transliteration.
    //     </span>
    //   </div>
    // );
  }

  saveAll_() {
    const allSaveButtons = this.individualWordsContainer_.current
      .querySelectorAll('.save-button');

    allSaveButtons.forEach((button) => button.click());
  }

  renderIndividualWords_() {
    return (
      <div ref={this.individualWordsContainer_}>
        <div className="title-row">
          <h2>Add individual words</h2>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.saveAll_()}
            className="save-all-button"
          >
            Save All
          </Button>
        </div>
        {this.renderItems()}
        <br/>
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.addRows_()}
        >
          + Add more words
        </Button>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderBulkUpload_()}
        {this.renderIndividualWords_()}
      </div>
    );
  }
}

export default AddWordsPage;
