import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import ApiUtils from '../utils/ApiUtils';
import AuthUtils from '../utils/AuthUtils';
import UserTable from './UserTable';
import './ManagementPage.css';

class ManagementPage extends React.Component {
  constructor(props) {
    super(props);

    this.authUtils_ = new AuthUtils();

    this.handleEmailChange_ = this.handleEmailChange_.bind(this);
    this.handleRoleSelected_ = this.handleRoleSelected_.bind(this);

    // Invite dialog button actions.
    this.openDialog_ = this.openDialog_.bind(this);
    this.closeDialog_ = this.closeDialog_.bind(this);

    this.state = {
      email: '',
      emailIsValid: false,
      inviteDialogIsOpen: false,
      inviteRole: 'Moderator',
      inviteInProgress: false,
      data: [],
      loading: true,
    };

    this.abortController = new AbortController();
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

  openDialog_() {
    this.setState({inviteDialogIsOpen: true});
  }

  closeDialog_() {
    this.setState({inviteDialogIsOpen: false});
  }

  handleRoleSelected_(e) {
    this.setState({inviteRole: e.target.value});
  }

  handleEmailChange_(e) {
    this.setState({
      emailIsValid: this.validateEmail_(e.target.value),
      email: e.target.value,
    });
  }

  validateEmail_(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  async updateRole_(email, role, revoke = false, forceCreate = false) {
    try {
      this.setState({inviteInProgress: true});
      const resp = await fetch(`${ApiUtils.origin}${ApiUtils.path}grant${role}Role`, {
        method: 'POST',
        body: JSON.stringify({email, revoke, forceCreate}),
        headers: {
          'Authorization': await AuthUtils.getAuthHeader(),
          'Content-Type': 'application/json',
        }
      });
      // Reload users after updating role.
      this.fetchUsers_();
    } catch(err) {
      console.error(err);
    }
    this.setState({inviteInProgress: false});
    this.closeDialog_();
  }

  render() {
    return (
      <div>
        <h1>User Management</h1>
        <div>
          <Button
            variant='contained'
            color='primary'
            onClick={this.openDialog_}
          >
            Invite users
          </Button>
        </div>
        <br/>
        <Dialog open={this.state.inviteDialogIsOpen} aria-labelledby='form-dialog-title'>
          <DialogTitle id='form-dialog-title'>Invite users</DialogTitle>
          <DialogContent>
            <DialogContentText>Add people</DialogContentText>
            <TextField
              label='Email'
              error={!this.state.emailIsValid}
              helperText={this.state.emailIsValid ? '' : 'Please enter a valid email address'}
              variant='outlined'
              margin='normal'
              fullWidth={true}
              onChange={this.handleEmailChange_}
              className='email-text-field'
            />
            <br/>
            <br/>
            <FormControl component='fieldset'>
              <FormLabel component='legend'>Assign role</FormLabel>
              <RadioGroup aria-label='role' value={this.state.inviteRole} onChange={this.handleRoleSelected_}>
                <FormControlLabel value='Moderator' control={<Radio color="primary"/>} label='Moderator'/>
                <FormHelperText className='role-text'>Can review user contributions</FormHelperText>
                <FormControlLabel value='Admin' control={<Radio color="primary"/>} label='Admin' />
                <FormHelperText className='role-text'>
                  Can review user contributions and manage app and user settings
                </FormHelperText>
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeDialog_}>
              Cancel
            </Button>
            {/* This UI is used for inviting users, so revoke=false and forceCreate=true */}
            <Button
              onClick={() => this.updateRole_(this.state.email, this.state.inviteRole, false, true)}
              disabled={!this.state.emailIsValid || this.state.inviteInProgress}
              color='primary'
            >
              Invite
            </Button>
          </DialogActions>
        </Dialog>
        <UserTable
          updateRole={(email, role, revoke) => this.updateRole_(email, role, revoke)}
          data={this.state.data}
          loading={this.state.loading}
        />
      </div>
    );
  }
}

export default ManagementPage;
