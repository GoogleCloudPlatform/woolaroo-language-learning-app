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
import AddIcon from "@material-ui/icons/Add";
import { Tooltip } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/InfoOutlined";

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
          <Typography variant="h5">Add Invidual words</Typography>
        </div>
        <div className="table-container">{this.renderItems()}</div>
        <br />
        <Button color="primary" onClick={() => this.addRows_()}>
          <AddIcon style={{ marginRight: "10px" }} /> Add more words
        </Button>
        <br />
        <br />
      </div>
    );
  }

  //Overriding method from parent to display list header
  renderItems() {
    if (this.state.items.length === 0) {
      return (
        <ul className="items-list">
          <h5>No results to show.</h5>
        </ul>
      );
    }

    return (
      <ul className="items-list">
        <li>
          <div className="add-word-list-item-header">
            <div className="list-first-header">
              <Typography variant="subtitle2">
                Word in [endangered language]
              </Typography>
            </div>
            <div className="list-second-header">
              <Typography variant="subtitle2">English Translation</Typography>
            </div>
            <div className="list-third-header">
              <Typography variant="subtitle2">
                Transliteration (optional)  
              </Typography>
              <Tooltip title="Explanation of transliteration" placement="top">
                  <InfoIcon style={{ marginLeft: "4px" }} />
              </Tooltip>
            </div>
          </div>
        </li>
        {this.state.items.map((item, itemIdx) => {
          return <AddWordsListItem key={itemIdx} item={item} />;
        })}
      </ul>
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
        <Toolbar />
        <div>
          <div>
            <Typography
              variant="subtitle1"
              className="prompt-text initial-prompt-text"
            >
              Contribute to the app by adding new words in [endangered language]
              and their translations. You can either upload words in bulk from a
              Google Sheet or .csv file, or add them in one by one.
            </Typography>

            {/* <Typography variant="h5" className="bulk-upload">
              Bulk Upload
            </Typography>
            <Typography variant="subtitle1" className="prompt-text">
              Format your file so that the column headers are XX, XX, XX, XX.{" "}
              <span style={{ textDecoration: "underline" }}>
                Example spreadsheet
              </span>
            </Typography>
            <div className="header-button-container">
              <Button
                color="primary"
                variant="outlined"
                className="upload-button"
              >
                Upload from Computer
              </Button>
              <Button
                color="primary"
                variant="outlined"
                className="add-from-drive"
              >
                <AddIcon style={{ marginRight: "10px" }} /> Add from Drive
              </Button>
            </div> */}
            <hr className="hr-divider" data-content="or" />
          </div>
          {this.renderIndividualWords_()}
        </div>
      </Dialog>
    );
  }
}

export default AddWordsPage;
