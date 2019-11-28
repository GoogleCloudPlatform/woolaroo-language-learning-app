import Button from "@material-ui/core/Button";
import React from "react";
import TextField from "@material-ui/core/TextField";
import AuthUtils from '../utils/AuthUtils';
import './SharingPage.css';

class SharingPage extends React.Component {
  copytext(target){
    target.select();
    document.execCommand('copy');
    }
  render(){
    return (
        <div>
          <h2>Share with friends</h2>

            <div>
                <TextField
                  id="app-link"
                  label="App URL"
                  className="fullwidth"
                  value={AuthUtils.app_url}
                  placeholder="ladino.appspot.com"
                />
                <div className="button-margin" >
                    <Button variant="contained" color="primary" 
                        onClick={() => this.copytext(document.getElementById('app-link'))}
                    >
                      Copy link
                    </Button>
                </div>
                <br/><br/>
                <div>
                    <TextField
                      id="contributor-app-link"
                      label="Contributor app URL"
                      className="fullwidth"
                      value={AuthUtils.app_url_contributor}
                      placeholder="ladino.appspot.com/contribute"
                    />
                    <div className="button-margin" >
                        <Button variant="contained" color="primary" 
                            onClick={() => this.copytext(document.getElementById('contributor-app-link'))}
                        >
                          Copy link
                        </Button>
                    </div>
                </div>
            </div>
    
        </div>
      );
  }

}

export default SharingPage;
