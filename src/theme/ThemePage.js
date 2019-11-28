import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import Button from '@material-ui/core/Button';
import ApiUtils from '../utils/ApiUtils';
import AuthUtils from '../utils/AuthUtils';
import Snackbar from '@material-ui/core/Snackbar';
import './ThemePage.css';

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
      disabled: true,
    }
    
    this.savedData = {}
  }
  async componentDidMount() {
    if (this.state.loading === true){
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
      const resp = await
        fetch(`${ApiUtils.origin}${ApiUtils.path}${this.state.loadaction}`, {
          headers: {
            'Authorization': await AuthUtils.getAuthHeader(),
          },
          signal: this.abortController.signal,
        });
      if (resp.status === 403) {
        await AuthUtils.signOut();
        return;
      }
      const result = await resp.json();
      this.setState({
        data:result.data,
        loading: false,
      });
      const { organization_name, organization_url, privacy_policy } = this.state.data;
      this.savedData = {
          organization_name: organization_name, 
          organization_url: organization_url, 
          privacy_policy: privacy_policy
      };
      
    } catch(err) {
      console.error(err);
    }
  }
  handleChange_organization_name = (e) => {
    const newvalue = e.target.value;
    this.setState(prevState => ({
        data: {
            ...prevState.data,
            organization_name:newvalue,
        }        
    }));
    this.setState({disabled:(newvalue === this.savedData.organization_name)});
  };
  handleChange_organization_url = (e) => {
    const newvalue = e.target.value.trim();
    this.setState(prevState => ({
        data: {
            ...prevState.data,
            organization_url:newvalue
        }        
    }));
    this.setState({disabled:(newvalue === this.savedData.organization_url)});
  };
  handleChange_privacy_policy = (e) => {
    const newvalue = e.target.value;
    this.setState(prevState => ({
        data: {
            ...prevState.data,
            privacy_policy:newvalue
        }        
    }));
    this.setState({disabled:(newvalue === this.savedData.privacy_policy)});
  };
  async setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }
  savechanges = async (e) => {
    try {
      // prevent the button from being clicked again.
      await this.setStateAsync({disabled: true});
      
      const { organization_name, organization_url, privacy_policy } = this.state.data;

      const resp = await fetch(`${ApiUtils.origin}${ApiUtils.path}updateSettings`, {
        method: 'POST',
        body: JSON.stringify({
          organization_name: organization_name, 
          organization_url: organization_url, 
          privacy_policy: privacy_policy
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': await AuthUtils.getAuthHeader(),
        }
      });
      if (resp.status === 403) {
        await AuthUtils.signOut();
        return;
      }
      await this.showPopup('Saved!');
      
      this.savedData = {
          organization_name: organization_name, 
          organization_url: organization_url, 
          privacy_policy: privacy_policy
      };
    } catch(err) {
      console.error(err);
    }
  };
  renderItems(){
    
    const classes = makeStyles(theme => ({
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
    return (
        <div>
            <div className={classes.newSection}>


                <TextField
                  required
                  id="organization-name"
                  label="Organization name"
                  value={this.state.data.organization_name}
                  className={[classes.textField, 'fullwidth'].join(' ')}
                  margin="normal"
                  onChange={this.handleChange_organization_name}
                />
                <br/>
                <TextField
                  id="organization-website"
                  label="Organization website"
                  value={this.state.data.organization_url}
                  className={[classes.textField, 'fullwidth'].join(' ')}
                  margin="normal"
                  onChange={this.handleChange_organization_url}
                />
                <br/>
                <TextField
                  id="optional-message"
                  multiline
                  rows="6"
                  value={this.state.data.privacy_policy}
                  placeholder="Terms and Conditions (optional)"
                  className={[classes.textField, 'fullwidth'].join(' ')}
                  margin="normal"
                  onChange={this.handleChange_privacy_policy}
                />

                <br/><br/>
                <div>
                    <Button variant="contained" color="primary" 
                        onClick={this.savechanges}
                        disabled={this.state.disabled}
                    >
                      Save Changes
                    </Button>
                </div>
                <br/><br/>
            </div>
           
            
            <br/><br/>
            <div className={classes.newSection}>
                <h2> Logo </h2>
                <Card className={classes.card}>
                  <img src={this.props.landing_image}
                    title="App Logo"
                    alt="App Logo"
                    className="app-logo"
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
                  <Button variant="contained" component="span" color="primary" className={classes.lastSection}>
                    Upload new
                  </Button>
                </label>
            </div>
            
            <br/><br/>
            <div className="newSection">
                <h2>Language Settings</h2>
                <TextField
                  id="endangered-language-helper"
                  label="Endangered&nbsp;language&nbsp;(read&nbsp;only)"
                  className={classes.textField}
                  margin="normal"
                  value={this.state.data.translation_language}
                />
                <br/>
                <TextField
                  id="primary-language-helper"
                  label="Primary&nbsp;language&nbsp;(read&nbsp;only)"
                  className={classes.textField}
                  margin="normal"
                  value={this.state.data.primary_language}
                />
                <br/>
                
            </div>

             <br/>
             <br/>
        </div>
      );
  
  }
  
  
  handleClose_() {
    this.setState({promo_open: false});
  }
  async showPopup(message) {
    await this.setState({promo_message: message, promo_open: true})
  }
  renderPromoMessage_() {
    if (!this.state.promo_message || !this.state.promo_open) {
      return null;
    }

    return (
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        message={<span id="message-id">{this.state.promo_message}</span>}
        onClose={this.handleClose_}
        open
      />
    );
  }
  render(){
    return (
        <div>
            <h2> Theme Customization </h2>
            {this.state.loading ? <div>Loading...</div> : this.renderItems()}
            <br/><br/>
            {this.renderPromoMessage_()}
        </div>
      );
  }
}
export default ThemePage;
