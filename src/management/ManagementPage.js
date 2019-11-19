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
      inviteDialogIsOpen: false,
      inviteRole: 'Moderator',
    };
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
    this.setState({email: e.target.value});
  }

  async grantAccess_(revoke = false) {
    // TODO: Parse & validate emails.
    try {
      const resp = await fetch(`${ApiUtils.origin}${ApiUtils.path}grant${this.state.inviteRole}Role`, {
        method: 'POST',
        body: JSON.stringify({
          email: this.state.email,
          revoke,
        }),
        headers: {
          'Authorization': await AuthUtils.getAuthHeader(),
          'Content-Type': 'application/json',
        }
      });

      const respMsg = await resp.json();
      if (respMsg) {
        alert(respMsg.message || respMsg);
      }
    } catch(err) {
      console.error(err);
    }
    this.closeDialog_();
  }

  render() {
    return (
      <div>
        <h2>User Management</h2>
        <div>
          <Button
            variant='contained'
            color='primary'
            onClick={this.openDialog_}
          >
            Invite moderators
          </Button>
        </div>
        <br/>
        <Dialog open={this.state.inviteDialogIsOpen} aria-labelledby='form-dialog-title'>
          <DialogTitle id='form-dialog-title'>Invite users</DialogTitle>
          <DialogContent>
            <DialogContentText>Add people</DialogContentText>
            <TextField
              label='Email'
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
                <FormControlLabel value='Moderator' control={<Radio />} label='Moderator' />
                <FormHelperText className='role-text'>Can review user contributions</FormHelperText>
                <FormControlLabel value='Admin' control={<Radio />} label='Admin' />
                <FormHelperText className='role-text'>
                  Can review user contributions and manage app and user settings
                </FormHelperText>
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeDialog_} color='primary'>
              Cancel
            </Button>
            <Button onClick={() => this.grantAccess_()} color='primary'>
              Invite
            </Button>
          </DialogActions>
        </Dialog>
        <UserTable />
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.grantAccess_('Moderator')}
            className="access-button"
          >
            Grant Moderator Access
          </Button>
        </div>
      </div>
    );
  }
}

export default ManagementPage;
