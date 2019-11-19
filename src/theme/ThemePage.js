import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 350
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 350
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  card: {
    maxWidth: 345,
    boxShadow: "none"
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  newSection: {
    marginTop: theme.spacing(12)
  },
  input: {
    display: 'none',
  },
  lastSection: {
    marginBottom: theme.spacing(12)
  },
}));

function ThemePage() {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    endangeredLanguage: "",
    primaryLanguage: "",
    name: ""
  });

  const handleChange = event => {
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value
    }));
  };

  return (
    <div>
      <div>
        <h2> Organization information </h2>
        <TextField
          required
          id="organization-name"
          label="Organization name"
          defaultValue=""
          className={classes.textField}
          margin="normal"
        />
        <br/>
        <TextField
          id="organization-website"
          label="Organization website"
          defaultValue=""
          className={classes.textField}
          margin="normal"
        />
      </div>
      <div className={classes.newSection}>
        <h2> Language information </h2>
        <form className={classes.root} autoComplete="off">
          <FormControl required className={classes.formControl}>
            <InputLabel htmlFor="endangered-language-helper">
              Choose language
            </InputLabel>
            <Select
              value={values.endangeredLanguage}
              onChange={handleChange}
              inputProps={{
                name: "endangeredLanguage",
                id: "endangered-language-helper"
              }}
            >
              <MenuItem value="">
                <em> None </em>
              </MenuItem>
              <MenuItem value={"Maori"}> Maori </MenuItem>
              <MenuItem value={"Nahuatl"}> Nahuatl </MenuItem>
              <MenuItem value={"Maya"}> Maya </MenuItem>
            </Select>
            <FormHelperText>
              The endangered language you are translating
            </FormHelperText>
          </FormControl>
        </form>
      </div>
      <div className={classes.newSection}>
        <h2> App information </h2>
        <TextField
          required
          id="app-name"
          label="App name"
          defaultValue=""
          className={classes.textField}
          margin="normal"
        />
        <form className={classes.root} autoComplete="off">
          <FormControl required className={classes.formControl}>
            <InputLabel htmlFor="primary-language-helper">
              Choose primary language
            </InputLabel>
            <Select
              value={values.primaryLanguage}
              onChange={handleChange}
              inputProps={{
                name: "primaryLanguage",
                id: "primary-language-helper"
              }}
            >
              <MenuItem value="">
                <em> None </em>
              </MenuItem>
              <MenuItem value={"English"}> English </MenuItem>
              <MenuItem value={"Spanish"}> Spanish </MenuItem>
              <MenuItem value={"Chinese"}> Chinese </MenuItem>
            </Select>
          </FormControl>
        </form>
        <TextField
          id="optional-message"
          multiline="multiline"
          rows="6"
          placeholder="Terms and Conditions (optional)"
          className={classes.textField}
          margin="normal"
        />
        <FormHelperText>
          Your own terms and conditions for people using your app
        </FormHelperText>

        <h3> Logo </h3>
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image="https://storage.googleapis.com/barnard-public-assets/Barnard%20lock%20up%202.1.png"
            title="App logo"
          />
        </Card>
        <input
        accept="image/*"
        className={classes.input}
        id="contained-button-file"
        multiple
        type="file"
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" component="span" className={classes.lastSection}>
            Upload new
          </Button>
        </label>
      </div>
    </div>
  );
}

export default ThemePage;
