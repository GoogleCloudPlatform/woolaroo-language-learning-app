import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import ApiUtils from '../utils/ApiUtils';
import AuthUtils from '../utils/AuthUtils';
import UserTable from './UserTable';
import './UserTable.css';

class ManagementPage extends React.Component {
  constructor(props) {
    super(props);

    this.authUtils_ = new AuthUtils();

    this.handleEmailChange_ = this.handleEmailChange_.bind(this);
    this.handleRoleSelected_ = this.handleRoleSelected_.bind(this);

    // Invite dialog button actions.
    this.handleOpen_ = this.handleOpen_.bind(this);
    this.handleClose_ = this.handleClose_.bind(this);    

    this.state = {
      email: '',
      inviteDialogIsOpen: false,
      inviteRole: 'moderator',
    };
  }

  handleEmailChange_(e) {
    this.setState({email: e.target.value});
  }

  handleOpen_() {
    this.setState({inviteDialogIsOpen: true});
  }

  handleClose_() {
    this.setState({inviteDialogIsOpen: false});
  }

  handleRoleSelected_(e) {
    this.setState({inviteRole: e.target.value});
  }

  async grantAccess_(role, revoke = false) {
    try {
      const resp = await fetch(`${ApiUtils.origin}${ApiUtils.path}grant${role}Role`, {
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
  }

  render() {
    return (
      <div>
        <h2>User Management</h2>
        <div>
          <TextField
            label="Email"
            variant="outlined"
            margin="normal"
            onChange={this.handleEmailChange_}
            className="email-text-field"
          />
        </div>
        <br/>
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.grantAccess_('Admin')}
            className="access-button"
          >
            Grant Admin Access
          </Button>
        </div>
        <br/>
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

        <Button
          variant='contained'
          color='primary'
          onClick={this.handleOpen_}
        >
          Invite users
        </Button>

        <Dialog open={this.state.inviteDialogIsOpen} aria-labelledby='form-dialog-title'>
          <DialogTitle id='form-dialog-title'>Invite users</DialogTitle>
          <DialogContent>


            <FormControl component='fieldset'>
              <FormLabel component='legend'>Assign role</FormLabel>
              <RadioGroup aria-label='role' value={this.state.inviteRole} onChange={this.handleRoleSelected_}>
                <FormControlLabel value='moderator' control={<Radio />} label='Moderator' />
                <FormControlLabel value='admin' control={<Radio />} label='Admin' />
              </RadioGroup>
            </FormControl>
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleClose_} color='primary'>
              Cancel
            </Button>
            <Button onClick={this.handleClose_} color='primary'>
              Invite
            </Button>
          </DialogActions>
        </Dialog>

        <UserTable />

      </div>
    );
  }
}

export default ManagementPage;
