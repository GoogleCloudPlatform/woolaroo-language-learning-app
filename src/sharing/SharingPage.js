import Button from "@material-ui/core/Button";
import React from "react";
import TextField from "@material-ui/core/TextField";
import AuthUtils from "../utils/AuthUtils";
import "./SharingPage.scss";
import { Typography } from "@material-ui/core";
import SocialMediaComponent from "./SocialMediaComponent";

class SharingPage extends React.Component {
  copytext(target) {
    target.select();
    document.execCommand("copy");
  }

  render() {
    return (
      <div className="sharing-page">
        <h1 className="header-text">Share with friends</h1>
        <div>
          <div className="invite-container-div">
            <div className="invite-email-div">
              <Typography variant="subtitle2" className="invite-email-text">
                Invite people to contribute
              </Typography>
              <TextField
                id="comma-seperated-emails"
                variant="outlined"
                className="invite-email-input"
                placeholder="Enter comma seperated emails"
              />
            </div>

            <TextField
              id="outlined-multiline-static"
              label="Write message (optional)"
              multiline
              rows="4"
              variant="outlined"
            />

            <Button
              variant="contained"
              color="primary"
              className="send-invite-button"
            >
              Send Invite
            </Button>
          </div>

          <div className="app-url-container">
            <div className="app-url-div">
              <Typography variant="subtitle2" className="app-url-text">
                App URL
              </Typography>
              <TextField
                id="app-link"
                variant="outlined"
                className="app-url-input"
                value={AuthUtils.app_url}
                placeholder="ladino.appspot.com"
              />
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.copytext(document.getElementById("app-link"))}
              className="copy-link-button"
            >
              Copy link
            </Button>
          </div>
          <div className="social-media-icons">
            <SocialMediaComponent
              socialMediaIcons={[
                "text://Social Media Icon",
                "text://Social Media Icon",
                "text://Social Media Icon"
              ]}
            />
          </div>

          <div className="contributor-container">
            <div className="contributor-url-div">
              <Typography variant="subtitle2" className="contributor-text">
                Contributor app URL
              </Typography>
              <TextField
                id="contributor-app-link"
                variant="outlined"
                className="contributor-input"
                value={AuthUtils.app_url_contributor}
                placeholder="ladino.appspot.com/contribute"
              />
            </div>
            <Button
              variant="contained"
              color="primary"
              className="copy-link-button"
              onClick={() =>
                this.copytext(document.getElementById("contributor-app-link"))
              }
            >
              Copy link
            </Button>
          </div>
          <div className="social-media-icons">
            <SocialMediaComponent
              socialMediaIcons={[
                "text://Social Media Icon",
                "text://Social Media Icon",
                "text://Social Media Icon"
              ]}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default SharingPage;