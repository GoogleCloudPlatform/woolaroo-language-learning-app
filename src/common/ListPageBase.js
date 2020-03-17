import React from "react";
import ApiUtils from "../utils/ApiUtils";
import AuthUtils from "../utils/AuthUtils";
import "./ListPageBase.css";
import Snackbar from "@material-ui/core/Snackbar";

class ListPageBase extends React.Component {
  constructor(props) {
    super(props);

    this.abortController = new AbortController();

    this.state = {
      loading: true,
      items: [],
      pageNum: null,
      pageSize: null,
      completeState: null,
      needsRecording: false,
      top500: false,
      // These values must be overridden by children.
      listItemTag: "",
      collectionName: "",
      pageTitle: "",
      promo_message: null,
      promo_open: false
    };
  }

  async componentDidMount() {
    await this.fetchItems();
  }

  async fetchItems() {
    if (!this.state.collectionName) {
      return;
    }

    this.abortController.abort();
    this.abortController = new AbortController();
    this.setState({ loading: true });

    if (this.state.collectionName === "feedback") {
      return this.fetchFlaggedItems_();
    }

    const {
      pageNum,
      pageSize,
      collectionName,
      completeState,
      needsRecording,
      top500,
      search
    } = this.state;
    let additionalParams = "";

    if (pageNum && pageSize) {
      additionalParams += `&pageNum=${pageNum}&pageSize=${pageSize}`;
    }

    if (completeState) {
      additionalParams += `&state=${completeState}`;
    }

    if (needsRecording) {
      additionalParams += `&needsRecording=1`;
    }

    if (search) {
      additionalParams += `&search=${search}`;
    }

    if (top500) {
      additionalParams += `&top500=1`;
    }

    try {
      const qs = `?collectionName=${collectionName}`;
      const resp = await fetch(
        `${ApiUtils.origin}${ApiUtils.path}getEntireCollection${qs}${additionalParams}`,
        {
          headers: {
            Authorization: await AuthUtils.getAuthHeader()
          },
          signal: this.abortController.signal
        }
      );
      if (resp.status === 403) {
        console.error(resp.text());
        return;
      }

      const items = await resp.json();

      this.setState({
        items,
        loading: false
      });
    } catch (err) {
      console.error(err);
    }
  }

  async fetchFlaggedItems_() {
    try {
      const authHeader = await AuthUtils.getAuthHeader();
      const resp = await fetch(
        `${ApiUtils.origin}${ApiUtils.path}getEntireFeedbackCollection`,
        {
          headers: {
            Authorization: authHeader
          },
          signal: this.abortController.signal
        }
      );

      //When there is no data - or there are any other failure response
      if (!resp.ok) {
        await this.showPopup("Failed to fetch data. Please try again!");
        this.setState({ loading: false });
        console.log("failureResponse", await resp.text());
        return;
      }

      const items = await resp.json();
      // Also fetches the current translation for each flagged item.
      const promises = items.map(async item => {
        const itemResp = await fetch(
          `${ApiUtils.origin}${ApiUtils.path}getTranslation`,
          {
            method: "POST",
            body: item.english_word,
            headers: {
              Authorization: authHeader
            }
          }
        );
        if (itemResp.status === 403) {
          await this.showPopup("Failed to fetch data. Please try again!");
          console.error(resp.text());
          return;
        }
        const currentItem = await itemResp.json();
        Object.assign(item, {
          curr_translation: currentItem.translation,
          curr_transliteration: currentItem.transliteration,
          curr_sound_link: currentItem.sound_link
        });
      });

      Promise.all(promises).then(() => {
        this.setState({
          items,
          loading: false
        });
      });
    } catch (err) {
      console.error(err);
      await this.showPopup("Failed to fetch data. Please try again!");
    }
  }

  renderPromoMessage_() {
    if (!this.state.promo_message || !this.state.promo_open) {
      return null;
    }
    return (
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        message={<span id="message-id">{this.state.promo_message}</span>}
        onClose={() => this.setState({ promo_open: false })}
        open
      />
    );
  }

  async showPopup(message) {
    await this.setState({ promo_message: message, promo_open: true });
  }

  renderItems() {
    if (this.state.items.length === 0) {
      return (
        <ul className="items-list">
          <h5>No results to show.</h5>
        </ul>
      );
    }

    const ListItemTag = this.state.listItemTag;
    return (
      <ul className="items-list">
        {this.state.items.map((item, itemIdx) => {
          return <ListItemTag key={itemIdx} item={item} />;
        })}
      </ul>
    );
  }

  render() {
    return (
      <div>
        <h1>{this.state.pageTitle}</h1>
        {this.state.loading ? <div>Loading...</div> : this.renderItems()}
      </div>
    );
  }
}

export default ListPageBase;
