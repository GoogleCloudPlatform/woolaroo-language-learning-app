import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

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
    width: 200
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

function ThemePage() {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    endangeredLanguage: "",
    name: "hai"
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
          id="standard-required"
          label="Organization name"
          defaultValue=""
          placeholder="Organization name"
          className={classes.textField}
          margin="normal"
        />
      </div>
      <div>
        <h2> Language information </h2>
        <form className={classes.root} autoComplete="off">
          <FormControl required className={classes.formControl}>
            <InputLabel htmlFor="endangered-language-helper">
              Choose Language
            </InputLabel>
            <Select
              value={values.endangeredLanguage}
              onChange={handleChange}
              inputProps={{
                name: "endangeredLanguage",
                id: "endangered-language-helper"
              }}>
              <MenuItem value="">
                <em> None </em>
              </MenuItem>
              <MenuItem value={"Maori"}> Maori </MenuItem>
              <MenuItem value={"Nahuatl"}> Nahuatl </MenuItem>
              <MenuItem value={"Maya"}> Maya </MenuItem>
            </Select>
            <FormHelperText>
              The endangered language you’ re translating
            </FormHelperText>
          </FormControl>
        </form>
      </div>
      <div>
        <h2> App information </h2> <h3> Logo </h3>
      </div>
    </div>
  );
}

export default ThemePage;
