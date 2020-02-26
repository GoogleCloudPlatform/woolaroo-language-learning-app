import React from "react";
import ListPageBase from "../common/ListPageBase";
import AddWordsListItem from "./AddWordsListItem";
import Button from "@material-ui/core/Button";
import "./AddWordsPage.scss";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";

const BASE_NUM_ROWS = 5;

class AddWordsPage extends ListPageBase {
  constructor(props) {
    super(props);

    this.individualWordsContainer_ = React.createRef();

    this.state = {
      ...this.state,
      loading: false,
      listItemTag: AddWordsListItem,
      items: [...this.state.items, ...this.getEmptyItems_()]
    };
  }

  getEmptyItems_() {
    const items = [];

    for (let i = 0; i < BASE_NUM_ROWS; i++) {
      items.push({
        id: this.state.items.length + i,
        english_word: "",
        primary_word: "",
        sound_link: "",
        translation: "",
        transliteration: "",
        frequency: -1
      });
    }

    return items;
  }

  addRows_() {
    this.setState({
      items: [...this.state.items, ...this.getEmptyItems_()]
    });
  }

  saveAll_() {
    const allSaveButtons = this.individualWordsContainer_.current.querySelectorAll(
      ".save-button"
    );

    allSaveButtons.forEach(button => button.click());
  }

  renderIndividualWords_() {
    return (
      <div ref={this.individualWordsContainer_}>
        <div className="title-row">
          <h1>Add individual words</h1>
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
        <br />
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.addRows_()}
        >
          + Add more words
        </Button>
        <br />
        <br />
      </div>
    );
  }

  render() {
    return (
      <Dialog fullScreen open={this.props.isOpen}>
        <AppBar color="primary">
          <Toolbar>
            <div className="appbar-containers">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="close"
                onClick={this.props.onClose}
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className="add-words-title-text">
                Add Word
              </Typography>
            </div>
            <div className="appbar-containers">
              <Button
                autoFocus
                color="primary"
                className="cancel-button"
                onClick={this.props.onClose}
              >
                Cancel
              </Button>
              <Button autoFocus variant="contained" color="primary">
                Add
              </Button>
            </div>
          </Toolbar>
        </AppBar>
        <div>{this.renderIndividualWords_()}</div>
      </Dialog>
    );
  }
}

export default AddWordsPage;
