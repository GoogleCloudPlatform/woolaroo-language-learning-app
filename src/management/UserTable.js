import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import './UserTable.css';
import ApiUtils from '../utils/ApiUtils';
import AuthUtils from '../utils/AuthUtils';

class UserTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = { loading: true, selected: {}, selectAll: 0, data: [] };

    this.abortController = new AbortController();
    this.toggleRow = this.toggleRow.bind(this);
  }

  async componentDidMount() {
    await this.fetchUsers_();
  }

  async fetchUsers_() {
    this.abortController.abort();
    this.abortController = new AbortController();
    try {
      const resp = await fetch(`${ApiUtils.origin}${ApiUtils.path}getUsers`, {
        headers: {
          'Authorization': await AuthUtils.getAuthHeader(),
        },
        signal: this.abortController.signal,
      });
      const data = await resp.json();
      this.setState({data, loading: false});
    } catch(err) {
      console.error(err);
    }
  }

  toggleRow(uid) {
    const newSelected = Object.assign({}, this.state.selected);
    newSelected[uid] = !this.state.selected[uid];
    this.setState({
      selected: newSelected,
      selectAll: 2,
    });
  }

  toggleSelectAll() {
    let newSelected = {};
    if (this.state.selectAll === 0) {
      this.state.data.forEach(x => {
        newSelected[x.uid] = true;
      });
    }
    this.setState({
      selected: newSelected,
      selectAll: this.state.selectAll === 0 ? 1 : 0,
    });
  }

  render() {
    const columns = [
      {
        Header: () => {
          const numSelected = Object.values(this.state.selected).filter(v => !!v).length;
          return `${numSelected} selected`;
        },
        columns: [
          {
            id: 'checkbox',
            accessor: '',
            Cell: ({ original }) => {
              return (
                <input
                  type='checkbox'
                  className='checkbox'
                  checked={this.state.selected[original.uid] === true}
                  onChange={() => this.toggleRow(original.uid)}
                />
              );
            },
            Header: () => {
              return (
                <input
                  type='checkbox'
                  className='checkbox'
                  checked={this.state.selectAll === 1}
                  ref={input => {
                    if (input) {
                      input.indeterminate = this.state.selectAll === 2;
                    }
                  }}
                  onChange={() => this.toggleSelectAll()}
                />
              );
            },
            sortable: false,
            width: 50,
          },
          {
            Header: 'Name',
            id: 'name',
            accessor: d => d.name,
          },
          {
            Header: 'Email',
            id: 'email',
            accessor: d => d.email,
          },
          {
            Header: 'Role',
            accessor: 'role',
          },
        ],
      }
    ];

    return (
      <div>
        <ReactTable
          data={this.state.data}
          columns={columns}
          defaultSorted={[{ id: 'name', desc: false }]}
          loading={this.state.loading}
          className='user-table'
        />
      </div>
    );
  }
}

export default UserTable;