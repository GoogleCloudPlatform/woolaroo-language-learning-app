import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
}));

function ThemePage() {
   const classes = useStyles();

  return (
    <div>
      <div>
      <h2>Organization information</h2>
      <TextField
        required
        id="standard-required"
        label="Organization name"
        defaultValue=""
        placeholder="Organization name"
        className={classes.textField}
        margin="normal"
      />
      </div>
      <div>
        <h2>Language information</h2>
      </div>
      <div>
        <h2>App information</h2>
        <h3>Logo</h3>
      </div>
    </div>
  );
}

export default ThemePage;
