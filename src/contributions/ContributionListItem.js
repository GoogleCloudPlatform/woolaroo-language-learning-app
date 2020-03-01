import React from "react";
import ListItemBase from "../common/ListItemBase";
import IconButton from "@material-ui/core/IconButton";
import RejectIcon from "@material-ui/icons/Block";
import SaveIcon from "@material-ui/icons/Done";
import ApiUtils from "../utils/ApiUtils";
import AuthUtils from "../utils/AuthUtils";
import "./ContributionListItem.scss";
import Tooltip from "@material-ui/core/Tooltip";

class ContributionListItem extends ListItemBase {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      error: false,
      collectionName: "suggestions"
    };
  }

  saveContribution_ = async e => {
    try {
      let {
        id,
        english_word,
        primary_word,
        sound_link,
        translation,
        transliteration
      } = this.state;
      english_word = ("" + english_word).trim();
      primary_word = ("" + primary_word).trim();
      translation = ("" + translation).trim();
      transliteration = ("" + transliteration).trim();

      if (!translation) {
        this.setState({
          // todo(parikshiv) - add visible error state, also
          // figure out if any of these can be empty?
          error: true
        });
        return;
      }

      const endpoint =
        this.state.collectionName === "feedback"
          ? "approveSuggestions"
          : "addTranslations";
      const resp = await fetch(
        `${ApiUtils.origin}${ApiUtils.path}${endpoint}`,
        {
          method: "POST",
          body: JSON.stringify({
            id,
            english_word,
            primary_word,
            translation,
            sound_link: sound_link || "",
            transliteration: transliteration || ""
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: await AuthUtils.getAuthHeader()
          }
        }
      );

      if (resp.status === 200) {
        if (this.state.collectionName === "suggestions") {
          this.deleteItem(e);
          return;
        }
        // Flagged items use the 'approveSuggestions' endpoint, which already
        // includes deleting the feedback, so there's no need to send another BE
        // request to delete.
        this.setState({
          deleted: true
        });
      } else {
        await this.showPopup("Failed to save. Please try again!");
        console.error(resp.text());
        return;
      }
    } catch (err) {
      await this.showPopup("Failed to save. Please try again!");
      console.error(err);
    }
  };

  renderEndOfRow() {
    return [
      <div className="reject-button-container">
        <Tooltip placement="top" title="Reject">
          <IconButton
            aria-label="delete"
            className="delete-contribution"
            key={1}
            onClick={this.showDeleteConfirm_}
          >
            <RejectIcon />
          </IconButton>
        </Tooltip>
      </div>,
      <div className="approve-button-container">
        <Tooltip placement="top" title="Approve">
          <IconButton
            aria-label="save"
            key={0}
            className="save-contribution"
            onClick={this.saveContribution_}
          >
            <SaveIcon />
          </IconButton>
        </Tooltip>
      </div>
    ];
  }

  render() {
    if (this.state.deleted) {
      return null;
    }

    return super.render();
  }
}

export default ContributionListItem;
