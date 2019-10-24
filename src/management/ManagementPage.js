import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ApiUtils from '../utils/ApiUtils';
import AuthUtils from '../utils/AuthUtils';

class ManagementPage extends React.Component {
  constructor(props) {
    super(props);

    this.authUtils_ = new AuthUtils();

    this.handleEmailChange_ = this.handleEmailChange_.bind(this);

    this.state = {
      email: '',
    };
  }

  handleEmailChange_(e) {
    this.setState({email: e.target.value});
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
      </div>
    );
  }
}

export default ManagementPage;
