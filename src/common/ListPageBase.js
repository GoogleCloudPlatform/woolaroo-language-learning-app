import React from 'react';
import ApiUtils from '../utils/ApiUtils';
import './ListPageBase.css';

class ListPageBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      // These values must be overridden by children.
      listItemTag: '',
      collectionName: '',
    };
  }

  async componentDidMount() {
    if (!this.state.collectionName) {
      return;
    }

    try {
      const qs = `?collectionName=${this.state.collectionName}`;
      const resp = await
        fetch(`${ApiUtils.origin}${ApiUtils.path}getEntireCollection${qs}`);

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
