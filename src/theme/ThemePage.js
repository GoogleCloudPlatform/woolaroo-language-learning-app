import React from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import ApiUtils from "../utils/ApiUtils";
import AuthUtils from "../utils/AuthUtils";
import Snackbar from "@material-ui/core/Snackbar";
import FormHelperText from "@material-ui/core/FormHelperText";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import ColorComponent from "./ColorComponent";

import "./ThemePage.scss";

const styles = theme => ({
  textField: {
    width: "100%"
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  },
  card: {
    maxWidth: 345,
    boxShadow: "none"
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
    backgroundSize: "contain"
  },
  newSection: {
    marginTop: theme.spacing(12)
  },
  input: {
    display: "none"
  },
  lastSection: {
    marginBottom: theme.spacing(12)
  }
});

class ThemePage extends React.Component {
  constructor(props) {
    super(props);
    //this.props.landing_image gets the image from App.js

    this.handleClose_ = this.handleClose_.bind(this);
    this.abortController = new AbortController();

    this.state = {
      loading: true,
      data: {},
      loadaction: "readSettings",
      promo_message: null,
      promo_open: false,
      disabled: true
    };

    this.savedData = {};
  }

  async componentDidMount() {
    if (this.state.loading === true) {
      await this.fetchData();
    }
  }
  async fetchData() {
    if (!this.state.loadaction) {
      return;
    }

    this.abortController.abort();
    this.abortController = new AbortController();
    this.setState({ loading: true });

    try {
      const resp = await fetch(
        `${ApiUtils.origin}${ApiUtils.path}${this.state.loadaction}`,
        {
          headers: {
            Authorization: await AuthUtils.getAuthHeader()
          },
          signal: this.abortController.signal
        }
      );
      if (resp.status === 403) {
        await AuthUtils.signOut();
        return;
      }
      const result = await resp.json();
      this.setState({
        data: result.data,
        loading: false
      });
      const {
        organization_name,
        organization_url,
        privacy_policy
      } = this.state.data;
      this.savedData = {
        organization_name: organization_name,
        organization_url: organization_url,
        privacy_policy: privacy_policy
      };
    } catch (err) {
      console.error(err);
    }
  }
  handleChange_organization_name = e => {
    const newvalue = e.target.value;
    this.setState(prevState => ({
      data: {
        ...prevState.data,
        organization_name: newvalue
      }
    }));
    this.setState({ disabled: newvalue === this.savedData.organization_name });
  };
  handleChange_organization_url = e => {
    const newvalue = e.target.value.trim();
    this.setState(prevState => ({
      data: {
        ...prevState.data,
        organization_url: newvalue
      }
    }));
    this.setState({ disabled: newvalue === this.savedData.organization_url });
  };
  handleChange_privacy_policy = e => {
    const newvalue = e.target.value;
    this.setState(prevState => ({
      data: {
        ...prevState.data,
        privacy_policy: newvalue
      }
    }));
    this.setState({ disabled: newvalue === this.savedData.privacy_policy });
  };
  async setStateAsync(state) {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  }
  savechanges = async e => {
    try {
      // prevent the button from being clicked again.
      await this.setStateAsync({ disabled: true });

      const {
        organization_name,
        organization_url,
        privacy_policy
      } = this.state.data;

      const resp = await fetch(
        `${ApiUtils.origin}${ApiUtils.path}updateSettings`,
        {
          method: "POST",
          body: JSON.stringify({
            organization_name: organization_name,
            organization_url: organization_url,
            privacy_policy: privacy_policy
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: await AuthUtils.getAuthHeader()
          }
        }
      );
      if (resp.status === 200) {
        this.savedData = {
          organization_name: organization_name,
          organization_url: organization_url,
          privacy_policy: privacy_policy
        };
        await this.showPopup("Saved!");
      } else {
        await this.showPopup("Something went wrong. Please try again!");
        console.error(resp.text());
        await this.setStateAsync({ disabled: false });
      }
    } catch (err) {
      await this.showPopup("Something went wrong. Please try again!");
      console.error(err);
    }
  };

  renderItems(classes) {
    return (
      <div>
        <div className="first-section">
          <h1 className-="theme-section-header-text">
            Organization information
          </h1>
          <div className="text-field">
            <TextField
              id="organization-name"
              label="Organization name"
              margin="normal"
              variant="outlined"
            />
          </div>
          <div className="text-field">
            <TextField
              id="organization-website"
              label="Organization website"
              margin="normal"
              variant="outlined"
            />
          </div>
        </div>
        <div className="new-section">
          <h1 className="theme-section-header-text">Language Information</h1>
          <div className="text-field">
            <TextField
              select
              labelId="theme-language-select-outlined-label"
              id="theme-language-select-outlined"
              value="Choose language"
              variant="outlined"
            >
              <MenuItem value="Choose language">Choose language</MenuItem>
              <MenuItem value="Maori"> Maori</MenuItem>
            </TextField>
            <FormHelperText className="form-helper-text">
              The endangered language you're translating
            </FormHelperText>
          </div>
        </div>
        <div className="app-information-section new-section">
          <h1 className="theme-section-header-text">App information</h1>
          <div className="text-field">
            <TextField
              id="app-name"
              label="App Name"
              margin="normal"
              variant="outlined"
            />
          </div>
          <div className="text-field">
            <TextField
              select
              labelId="theme-language-primary-outlined-label"
              id="theme-language-primary-select-outlined"
              value="Choose Primary Language"
              variant="outlined"
            >
              <MenuItem value="Choose Primary Language">
                Choose Primary Language
              </MenuItem>
              <MenuItem value="English"> English</MenuItem>
            </TextField>
            <FormHelperText className="form-helper-text">
              Help text
            </FormHelperText>
          </div>
          <div className="text-field">
            <TextField
              id="optional-message"
              multiline
              rows="6"
              variant="outlined"
              value={this.state.data.privacy_policy || ""}
              placeholder="Terms and Conditions (optional)"
              margin="normal"
              onChange={this.handleChange_privacy_policy}
            />
            <FormHelperText className="form-helper-text">
              Your own terms and conditions for people using your app
            </FormHelperText>
          </div>
          <div className="logo-section">
            <h2 className="theme-section-header-subtext"> Logo </h2>
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image={this.props.landing_image}
                title="App logo"
                alt="App Logo"
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
              <Button variant="contained" component="span" color="primary">
                Upload new
              </Button>
            </label>
          </div>

          <div className="primary-color-section">
            <h2 className="theme-section-header-subtext"> Primary color </h2>
            <Typography variant="subtitle2">
              Buttons in your app will appear in this color
            </Typography>
            <div className="choose-color-container">
              <RadioGroup aria-label="gender" row>
                <FormControlLabel
                  value="#9F2958"
                  control={<Radio />}
                  label={<ColorComponent color="#9F2958" />}
                  labelPlacement="top"
                />
                <FormControlLabel
                  value="#A23D1E"
                  control={<Radio />}
                  label={<ColorComponent color="#A23D1E" />}
                  labelPlacement="top"
                />
                <FormControlLabel
                  value="#2A635A"
                  control={<Radio />}
                  label={<ColorComponent color="#2A635A" />}
                  labelPlacement="top"
                />
                <FormControlLabel
                  value="#293A8D"
                  control={<Radio />}
                  label={<ColorComponent color="#293A8D" />}
                  labelPlacement="top"
                />
                <FormControlLabel
                  value="#612995"
                  control={<Radio />}
                  label={<ColorComponent color="#612995" />}
                  labelPlacement="top"
                />
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleClose_() {
    this.setState({ promo_open: false });
  }
  async showPopup(message) {
    await this.setState({ promo_message: message, promo_open: true });
  }
  renderPromoMessage_() {
    if (!this.state.promo_message || !this.state.promo_open) {
      return null;
    }

    return (
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        message={<span id="message-id">{this.state.promo_message}</span>}
        onClose={this.handleClose_}
        open
      />
    );
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.state.loading ? <div>Loading...</div> : this.renderItems(classes)}
        <br />
        <br />
        {this.renderPromoMessage_()}
      </div>
    );
  }
}
export default withStyles(styles)(ThemePage);
