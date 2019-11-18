import React from 'react';
import ReactTable from 'react-table';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import 'react-table/react-table.css'
import './UserTable.css';

class UserTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      // TODO: Wire up real data.
      data: makeData(),
      selected: {},
      selectAll: 0,
      changeRoleDialogIsOpen: false,
      newRole: 'None',
    };

    // Invite dialog button actions.
    // TODO: Refactor shared code between invite & change role dialogs.
    this.openDialog_ = this.openDialog_.bind(this);
    this.closeDialog_ = this.closeDialog_.bind(this);
    this.handleRoleSelected_ = this.handleRoleSelected_.bind(this);
    this.changeRoles_ = this.changeRoles_.bind(this);

    this.toggleRow = this.toggleRow.bind(this);
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

  openDialog_() {
    this.setState({changeRoleDialogIsOpen: true});
  }

  closeDialog_() {
    this.setState({changeRoleDialogIsOpen: false});
  }

  handleRoleSelected_(e) {
    this.setState({newRole: e.target.value});
  }

  changeRoles_() {
    const selectedUsers =this.state.data.filter(
      user => (this.state.selected[user.uid] && user.role !== this.state.newRole));

    if (this.state.newRole === 'None') {
      // Revoke the current role for all selected users.
      selectedUsers.forEach(
        user => this.props.updateRole(user.email, user.role, true /* revoke*/));
    } else {
      // Grant newRole to all selected users.
      selectedUsers.forEach(
        user => this.props.updateRole(user.email, this.state.newRole, false /* revoke*/));
    }

    this.closeDialog_();
  }

  renderChangeRoleDialog_() {
    return (
      <Dialog open={this.state.changeRoleDialogIsOpen} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title' className='role-dialog-title'>Change roles</DialogTitle>
        <DialogContent>
          <FormControl component='fieldset'>
            <RadioGroup aria-label='role' value={this.state.newRole} onChange={this.handleRoleSelected_}>
              <FormControlLabel value='Moderator' control={<Radio />} label='Moderator' />
              <FormHelperText className='role-text'>Can review user contributions</FormHelperText>
              <FormControlLabel value='Admin' control={<Radio />} label='Admin' />
              <FormHelperText className='role-text'>
                Can review user contributions and manage app and user settings
              </FormHelperText>
              <FormControlLabel value='None' control={<Radio />} label='None' />
              <FormHelperText className='role-text'>
                Remove roles for the user. Can no longer review user contributions or manage settings
              </FormHelperText>                
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeDialog_} color='primary'>
            Cancel
          </Button>
          <Button onClick={() => this.changeRoles_()} color='primary'>
            Change
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    const columns = [
      {
        Header: () => {
          const numSelected = Object.values(this.state.selected).filter(v => !!v).length;
          if (numSelected) {
            return (
              <div onClick={() => this.openDialog_()} className='user-table-header'>
                <span>{numSelected} selected</span>
                <div className='user-table-header-spacer' />
                <span>Change roles</span>
              </div>
            );
          } else {
            return <div>0 selected</div>
          }
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
          className='user-table'
        />
        {this.renderChangeRoleDialog_()}
      </div>
    );
  }
}

export default UserTable;

function makeData() {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map(i => {
    return {
      uid: i,
      name: 'Dimsum' + i,
      email: i + '@dimsum.com',
      role: 'Admin',
    }
  });
}