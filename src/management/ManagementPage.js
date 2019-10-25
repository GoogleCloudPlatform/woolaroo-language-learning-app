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
import UserTable from './UserTable';
import './UserTable.css';

const useStyles = makeStyles(theme => ({
  button: {
    margin: '0 0 20px 0',
  },
  formControl: {
    margin: '0',
  },
}));

function ManagementPage() {
  const classes = useStyles();

	const [inviteDialogIsOpen, setInviteDialogOpen] = React.useState(false);
	const handleOpen = () => {
		setInviteDialogOpen(true);
	}
	const handleClose = () => {
		setInviteDialogOpen(false);
	}	

	const [inviteRole, setInviteRole] = React.useState('moderator');
	const handleRoleSelected = (event) => {
		setInviteRole(event.target.value);
	}

  return (
    <div>
      <h2>User Management</h2>
      <Button
      	variant='contained'
      	color='primary'
      	onClick={handleOpen}
      	className={classes.button}
    	>
        Invite users
      </Button>

      <Dialog open={inviteDialogIsOpen} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Invite users</DialogTitle>
        <DialogContent>
          <DialogContentText>Add people</DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Email Address'
            type='email'
            fullWidth
          />
          <DialogContentText>
            Enter comma-separated emails
          </DialogContentText>
          <DialogContentText>Assign role</DialogContentText>

		      <FormControl component="fieldset" className={classes.formControl}>
		        <FormLabel component="legend">Gender</FormLabel>
		        <RadioGroup aria-label="gender" name="gender1" value={inviteRole} onChange={setInviteRole}>
		          <FormControlLabel value="moderator" control={<Radio />} label="Moderator" />
		          <FormControlLabel value="admin" control={<Radio />} label="Admin" />
		        </RadioGroup>
		      </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleClose} color='primary'>
            Invite
          </Button>
        </DialogActions>
      </Dialog>

      <UserTable />
    </div>
  );
}

export default ManagementPage;
