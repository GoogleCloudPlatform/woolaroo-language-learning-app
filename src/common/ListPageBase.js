import React from 'react';
import ApiUtils from '../utils/ApiUtils';
import AuthUtils from '../utils/AuthUtils';
import './ListPageBase.css';

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
      listItemTag: '',
      collectionName: '',
      pageTitle: '',
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
    const {
      pageNum,
      pageSize,
      collectionName,
      completeState,
      needsRecording,
      top500,
      search,
    } = this.state;
    let additionalParams = '';

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
      let endpoint = `${ApiUtils.origin}${ApiUtils.path}`;
      if (collectionName === 'feedback') {
        endpoint += 'getEntireFeedbackCollection';
      } else {
        const qs = `?collectionName=${collectionName}`;
        endpoint += `getEntireCollection${qs}${additionalParams}`;
      }
      const resp = await
        fetch(endpoint, {
          headers: {
            'Authorization': await AuthUtils.getAuthHeader(),
          },
          signal: this.abortController.signal,
        });
      if (resp.status === 403) {
        await AuthUtils.signOut();
        return;
      }

      const items = await resp.json();

      this.setState({
        items,
        loading: false,
      });
    } catch(err) {
      console.error(err);
    }
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
        {
          this.state.items.map((item, itemIdx) => {
            return (
              <ListItemTag
                key={itemIdx}
                item={item}
              />
            );
          })
        }
      </ul>
    );
  }

  render() {
    return (
      <div>
        <h2>{this.state.pageTitle}</h2>
        {this.state.loading ? <div>Loading...</div> : this.renderItems()}
      </div>
    );
  }
}

export default ListPageBase;
