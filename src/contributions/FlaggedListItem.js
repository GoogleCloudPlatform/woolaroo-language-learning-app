import React from "react";
import AudioRecorder from "../audio/AudioRecorder";
import ContributionListItem from "./ContributionListItem";
import IconButton from "@material-ui/core/IconButton";
import RejectIcon from "@material-ui/icons/Block";
import SaveIcon from "@material-ui/icons/Done";
import WarningIcon from "@material-ui/icons/ReportProblemOutlined";
import "./ContributionListItem.scss";
import "./FlaggedListItem.scss";
import AuthUtils from "../utils/AuthUtils";
import Tooltip from "@material-ui/core/Tooltip";

class FlaggedListItem extends ContributionListItem {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      collectionName: "feedback"
    };
  }

  getFlaggedTypeStr_() {
    if (this.state.types.length === 2) {
      return "Marked as incorrect and offensive";
    }
    if (this.state.types.includes("IncorrectTranslation")) {
      return "Marked as incorrect";
    }
    if (this.state.types.includes("OffensiveTranslation")) {
      return "Marked as offensive";
    }
    // Shouldn't actually happen.
    return "Marked for unknown reason";
  }

  renderBaseWord() {
    if (AuthUtils.getPrimaryLanguage() === "English") {
      return (
        <Tooltip title={this.state.english_word} placement="bottom-start">
          <div className="flagged-base-word">{this.state.english_word}</div>
        </Tooltip>
      );
    } else {
      const primary_word =
        !this.state.primary_word || this.state.primary_word === ""
          ? this.state.english_word
          : this.state.primary_word;
      return (
        <Tooltip title={primary_word} placement="bottom-start">
          <div className="flagged-base-word">
            {primary_word}
            <div className="english-word-small">{this.state.english_word}</div>
          </div>
        </Tooltip>
      );
    }
  }

  render() {
    if (this.state.deleted) {
      return null;
    }
    const emptyTranslation = (
      <div className="empty-field">No existing translation</div>
    );
    const emptyTransliteration = (
      <div className="empty-field">No existing transliteration</div>
    );

    return (
      <li className="flagged-list-item">
        <div className="flagged-reason">
          <WarningIcon className="warning-icon" />
          {this.getFlaggedTypeStr_()}: "{this.state.content}"
        </div>
        <div className="list-item-flagged-content">
          <div>{this.renderBaseWord()}</div>
          <div className="flagged-translation">
            {this.state.curr_translation || emptyTranslation}{" "}
          </div>
          <div className="flagged-transliteration">
            {this.state.curr_transliteration || emptyTransliteration}
          </div>
          <div className="flagged-audio-recorder">
            <AudioRecorder
              audioUrl={this.state.curr_sound_link}
              disableRecord={true}
              key={0}
            />
          </div>
          <div className="flagged-edit-translations">
            {this.renderTranslation()}
          </div>
          <div className="flagged-edit-transliterations">
            {this.renderTransliteration()}
          </div>
          <div className="flagged-edit-audio-recorder">
            {this.renderAudioRecorder()}
          </div>
          <div className="flagged-edit-row-end">{this.renderEndOfRow()}</div>
        </div>
        {this.renderPromoMessage()}
        {this.renderDeleteConfirmAlert()}
      </li>
    );
  }
}

export default FlaggedListItem;
