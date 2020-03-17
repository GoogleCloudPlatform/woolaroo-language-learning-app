import React from "react";
import ListPageBase from "../common/ListPageBase";
import PaginationWidget from "../common/filters/PaginationWidget";
import StateSelection from "../common/filters/StateSelection";
import FilterChips from "../common/filters/FilterChips";
import TranslationListItem from "./TranslationListItem";
import Typography from "@material-ui/core/Typography";
import { withRouter } from "react-router-dom";
import "./TranslationsPage.scss";
import LinearProgress from "@material-ui/core/LinearProgress";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";

const BorderLinearProgress = withStyles({
  root: {
    height: 10,
    backgroundColor: "#FFFFFF",
    border: "1px solid #e0e0e0",
    borderRadius: "8px"
  },
  bar: {
    borderRadius: 20,
    backgroundColor: "#D5EEE2"
  }
})(LinearProgress);

class TranslationsPage extends ListPageBase {
  constructor(props) {
    super(props);
    this.updatePageNum = this.updatePageNum.bind(this);
    this.updateCompleteState = this.updateCompleteState.bind(this);
    this.updateNeedsRecording = this.updateNeedsRecording.bind(this);
    this.updateTop500 = this.updateTop500.bind(this);

    const queryStringParams = new URLSearchParams(props.location.search);
    const needsRecording = queryStringParams.get("needsRecording");
    const top500 = queryStringParams.get("top500");
    const search = queryStringParams.get("search");

    let pageNum;
    if (props.match && props.match.params) {
      pageNum = +props.match.params.pageNum;
    }

    //Handle search when coming from another page
    if (search) {
      this.state = {
        ...this.state,
        listItemTag: TranslationListItem,
        collectionName: "translations",
        pageSize: 25,
        completeState: queryStringParams.get("state"),
        needsRecording: false,
        top500: false,
        pageNum: pageNum || 1,
        search: queryStringParams.get("search")
      };
    } else {
      this.state = {
        ...this.state,
        listItemTag: TranslationListItem,
        collectionName: "translations",
        pageSize: 25,
        completeState: "incomplete",
        needsRecording: !!(needsRecording && needsRecording !== "0"),
        top500: top500 !== "0",
        pageNum: pageNum || 1,
        search: queryStringParams.get("search")
      };
    }
  }

  async componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      //clear filter when searching a new word from translation page
      const queryStringParams = new URLSearchParams(this.props.location.search);
      const newSearch = queryStringParams.get("search") || "";
      if (newSearch !== this.state.search) {
        await this.setState({
          search: newSearch,
          top500: false, //clear filters when doing a fresh search
          needsRecording: false, //clear filters when doing a fresh search

          pageNum: 1
        });
        await this.fetchItems();
      }
    }
  }

  async updateCompleteState(nextCompleteState) {
    let nextHistory = "/translations/1";
    if (nextCompleteState) {
      nextHistory += `&state=${nextCompleteState}`;
    }
    if (!this.state.top500) {
      nextHistory += `&top500=0`;
    }
    if (this.state.needsRecording) {
      nextHistory += `&needsRecording=1`;
    }
    this.props.history.push(nextHistory);
    await this.setState({
      completeState: nextCompleteState,
      loading: true,
      pageNum: 1
    });
    await this.fetchItems();
  }

  async updatePageNum(nextPageNum) {
    this.props.history.push(
      `/translations/${nextPageNum}${this.props.location.search}`
    );
    await this.setState({ pageNum: nextPageNum, loading: true });
    await this.fetchItems();
  }

  async updateNeedsRecording(nextNeedsRecording) {
    let nextHistory = `/translations/1?state=${this.state.completeState ||
      "all"}`;
    if (!this.state.top500) {
      nextHistory += `&top500=0`;
    }
    if (nextNeedsRecording) {
      nextHistory += `&needsRecording=1`;
    }
    if (this.state.search && (this.state.search + "").length > 0) {
      //to avoid resetting search query after filtering
      nextHistory += `&search=` + encodeURIComponent(this.state.search);
    }
    this.props.history.push(nextHistory);
    await this.setState({
      needsRecording: nextNeedsRecording,
      loading: true,
      pageNum: 1
    });
    await this.fetchItems();
  }

  async updateTop500(nextTop500) {
    let nextHistory = `/translations/1?state=${this.state.completeState ||
      "all"}`;
    if (this.state.needsRecording) {
      nextHistory += `&needsRecording=1`;
    }
    if (!nextTop500) {
      nextHistory += `&top500=0`;
    }
    if (this.state.search && (this.state.search + "").length > 0) {
      //to avoid resetting search query after filtering
      nextHistory += `&search=` + encodeURIComponent(this.state.search);
    }
    this.props.history.push(nextHistory);
    await this.setState({ top500: nextTop500, loading: true, pageNum: 1 });
    await this.fetchItems();
  }

  renderPaginationWidget_() {
    if (
      this.state.items.length < this.state.pageSize &&
      this.state.pageNum === 1
    ) {
      return null;
    }

    return (
      <PaginationWidget
        pageNum={this.state.pageNum}
        updatePageNum={this.updatePageNum}
        lastPage={this.state.items.length < this.state.pageSize}
      />
    );
  }

  renderStateSelection_() {
    return (
      <StateSelection
        completeState={this.state.completeState}
        updateCompleteState={this.updateCompleteState}
      />
    );
  }

  renderFilterChips_() {
    return (
      <FilterChips
        needsRecording={this.state.needsRecording}
        top500={this.state.top500}
        updateNeedsRecording={this.updateNeedsRecording}
        updateTop500={this.updateTop500}
      />
    );
  }

  renderItems() {
    return (
      <div>
        {super.renderItems()}
        {this.renderPaginationWidget_()}
      </div>
    );
  }

  getProgressNumber() {
    return "324/5000";
  }

  renderBottomProgressBar() {
    //Check if it is loading or does not have any items
    return (
      <div
        className={`progress-bar-container ${
          this.state.items.length === 0 || this.state.loading
            ? "bottom-banner-fixed"
            : " "
        }`}
      >
        <div className="progress-div">
          <Tooltip
            title={this.getProgressNumber() + " words completed"}
            placement="top"
          >
            <BorderLinearProgress
              variant="determinate"
              color="secondary"
              value={50}
            />
          </Tooltip>
        </div>
        <div class="progress-text">
          <Typography variant="subtitle2" align="center">
            <span className="progress-number">{this.getProgressNumber()}</span>{" "}
            words completed
          </Typography>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h1>Translations</h1>
        {this.renderStateSelection_()}
        {this.renderFilterChips_()}
        {this.state.loading ? <div>Loading...</div> : this.renderItems()}
        {this.renderBottomProgressBar()}
      </div>
    );
  }
}

const TranslationsPageWithRouter = withRouter(TranslationsPage);

export { TranslationsPageWithRouter, TranslationsPage };
