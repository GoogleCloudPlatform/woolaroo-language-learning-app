import React from 'react';
import ApiUtils from '../utils/ApiUtils';
import './ListPageBase.css';

class ListPageBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      pageNum: null,
      pageSize: null,
      completeState: null,
      // These values must be overridden by children.
      listItemTag: '',
      collectionName: '',
    };
  }

  async componentDidMount() {
    await this.fetchItems();
  }

  async fetchItems() {
    if (!this.state.collectionName) {
      return;
    }

    this.setState({ loading: true });

    const {pageNum, pageSize, collectionName, completeState} = this.state;
    let additionalParams = '';

    if (pageNum && pageSize) {
      additionalParams += `&pageNum=${pageNum}&pageSize=${pageSize}`;
    }

    if (completeState) {
      additionalParams += `&state=${completeState}`;
    }

    try {
      const qs = `?collectionName=${collectionName}`;
      const resp = await
        fetch(`${ApiUtils.origin}${ApiUtils.path}getEntireCollection${qs}${additionalParams}`);

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
        {this.state.loading ? <div>Loading...</div> : this.renderItems()}
      </div>
    );
  }
}

export default ListPageBase;
