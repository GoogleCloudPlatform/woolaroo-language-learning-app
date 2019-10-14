import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import React from "react";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 350
  },
  button: {
    margin: theme.spacing(1)
  }
}));

function SharingPage() {
  const classes = useStyles();
  return (
    <div>
      <h2>Share with friends</h2>

      <div>
        <TextField
          id="share-emails"
          label="Invite people to contribute"
          style={{
            margin: 8
          }}
          placeholder="Enter comma separated emails"
          className={classes.textField}
          InputLabelProps={{
            shrink: true
          }}
        />
      </div>

      <div>
        <TextField
          id="optional-message"
          multiline="multiline"
          rows="4"
          placeholder="Write message (optional)"
          className={classes.textField}
          margin="normal"
        />
      </div>

      <Button variant="contained" color="primary" className={classes.button}>
        Send Invite
      </Button>

      <div>
        <TextField
          id="app-link"
          label="App URL"
          style={{
            margin: 8
          }}
          placeholder="ladino.appspot.com"
          className={classes.textField}
          InputLabelProps={{
            shrink: true
          }}
        />
      </div>
      <Button variant="contained" color="primary" className={classes.button}>
        Copy link
      </Button>

      <div>
        <TextField
          id="contributor-app-link"
          label="Contributor app URL"
          style={{
            margin: 8
          }}
          placeholder="ladino.appspot.com/contribute"
          className={classes.textField}
          InputLabelProps={{
            shrink: true
          }}
        />
      </div>
      <Button variant="contained" color="primary" className={classes.button}>
        Copy link
      </Button>
    </div>
  );
}

export default SharingPage;
