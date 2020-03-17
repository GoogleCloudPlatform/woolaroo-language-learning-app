import React from "react";
import ListPageBase from "../common/ListPageBase";
import ContributionListItem from "./ContributionListItem";
import FlaggedListItem from "./FlaggedListItem";
import "./ContributionsPage.scss";
import { LIST_ITEM_TITLE } from "../utils/TableUtils";
import Typography from "@material-ui/core/Typography";

const TAB_TO_ITEM = {
  new: { listItemTag: ContributionListItem, collectionName: "suggestions" },
  flagged: { listItemTag: FlaggedListItem, collectionName: "feedback" }
};

class ContributionsPage extends ListPageBase {
  constructor(props) {
    super(props);
    const initialTab = "new";
    this.state = {
      ...this.state,
      pageTitle: LIST_ITEM_TITLE.CONTRIBUTIONS,
      tab: initialTab,
      listItemTag: TAB_TO_ITEM[initialTab].listItemTag,
      collectionName: TAB_TO_ITEM[initialTab].collectionName
    };
  }

  async handleTabClick_(e, nextTab) {
    e.preventDefault();
    await this.setState({
      tab: nextTab,
      listItemTag: TAB_TO_ITEM[nextTab].listItemTag,
      collectionName: TAB_TO_ITEM[nextTab].collectionName,
      loading: true
    });
    await this.fetchItems();
  }

  renderTabSelection_() {
    return (
      <div className="contributions-state-selection">
        <ul>
          <li
            className={this.state.tab === "new" ? "selected" : null}
            onClick={
              this.state.loading ? null : e => this.handleTabClick_(e, "new")
            }
          >
            <a href="#">New additions</a>
          </li>
          <li
            className={this.state.tab === "flagged" ? "selected" : null}
            onClick={
              this.state.loading
                ? null
                : e => this.handleTabClick_(e, "flagged")
            }
          >
            <a href="#">Flagged by user</a>
          </li>
        </ul>
      </div>
    );
  }

  render() {
    return (
      <div>
        <Typography 
        variant="subtitle1"
        >
          Approve, edit or reject the following contributions from users
        </Typography>
        {this.renderTabSelection_()}
        {this.state.loading ? <div>Loading...</div> : this.renderItems()}
        {this.renderPromoMessage_()}
      </div>
    );
  }
}

export default ContributionsPage;
