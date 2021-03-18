import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import  { Breakpoint, BreakpointProvider, setDefaultBreakpoints } from 'react-socks';
import './App.scss';
import AddWordsPage from './addWords/AddWordsPage';
import { TranslationsPageWithRouter } from './translations/TranslationsPage';
import ContributionsPage from './contributions/ContributionsPage';
import ThemePage from './theme/ThemePage';
import AuthUtils from './utils/AuthUtils';
import ApiUtils from "../utils/ApiUtils";
import SharingPage from './sharing/SharingPage';
import ManagementPage from './management/ManagementPage';
import Header from './header/Header';
import NavMenu from './navmenu/NavMenu';
import Button from "@material-ui/core/Button";

const ROUTES = {
  ADD_WORDS: '/add-words',
  TRANSLATIONS: '/',
  CONTRIBUTIONS: '/user-contributions',
  THEME: '/theme',
  SHARING: '/sharing',
  MANAGEMENT: '/management',
};

setDefaultBreakpoints([
  { small: 500 }, // mobile devices (not sure which one's this big)
  { medium: 800 }, // ipad, ipad pro, ipad mini, etc
  { large: 1086 }, // smaller laptops
  { xlarge: 1280 } // laptops and desktops
]);

//Note: When SIGNIN_ASSET is an external URL, it may not show up on browsers in content blocking mode (tracking protection)

const SIGNIN_ASSET = "https://developers.google.com/identity/images/btn_google_signin_light_normal_web.png";
const WOOLAROO_URL = "/";
const WOOLAROO_IMG = "https://storage.googleapis.com/barnard-public-assets/woolaroo_logo.png";
const LANDING_IMG = WOOLAROO_IMG;


class App extends React.Component {
  constructor(props) {
    super(props);

    this.authUtils_ = new AuthUtils();

    this.state = {
      email: null,
      authInitializing: true,
      organization_name: "",
      organization_url: "",
      newuseremail: ""
    };

  }

  

  componentDidMount() {
    this.setFirstUserAsAdmin_();
    this.authUtils_.getFirebaseAuth().onAuthStateChanged(async (user) => {
      if (!user) {
        this.setState({email: null, authInitializing: false});
        return;
      }

      const idTokenResult = await user.getIdTokenResult();
      const mainApp = this;
      if (idTokenResult.claims.admin || idTokenResult.claims.moderator) {
        if (idTokenResult.claims.admin){
            AuthUtils.setUserType("admin");
        }else if (idTokenResult.claims.moderator){
            AuthUtils.setUserType("moderator");
        }
        AuthUtils.setUser(user);
        AuthUtils.fsdb.collection("app_settings").doc("default").get().then((querySnapshot) => {
            const app_settings = querySnapshot.data();
            AuthUtils.setAppSettings(app_settings);
            mainApp.setState({email: user.email, authInitializing: false, newuser: false, newuseremail:""});
        })
      } else {
        //Other User Not Yet Authorized as admin/moderator
        const newuseremail = (user.email)?user.email:"";
        AuthUtils.fsdb.collection("app_settings").doc("default").get().then((querySnapshot) => {
            const app_settings = querySnapshot.data();
            AuthUtils.setAppSettings(app_settings);
            mainApp.logOut_();
        }).catch((err)=>{
            mainApp.logOut_();
        });
        mainApp.setState({newuser: true, newuseremail:newuseremail});
      }
    });
  }
  
  setFirstUserAsAdmin_() {
    try {
      fetch(`${ApiUtils.origin}${ApiUtils.path}setFirstUserAsAdmin`);
    } catch (err) {
      console.error(err);
    }
  }

  async logIn_() {
    try {
      await this.authUtils_.signInWithPopup();
    } catch(err) {
      console.error(err);
    }
  }

  async logOut_() {
    try {
      await AuthUtils.signOut();
      AuthUtils.setUser("");
    } catch(err) {
      console.error(err);
    }
  }

  async authAction_() {
    if (this.state.email) {
      this.logOut_();
    } else {
      this.logIn_();
    }
  }

  renderBody() {
    if (this.state.authInitializing) {
      return null;
    } else if (this.state.newuser===true){
      let contactmessage = "";
      if (this.state.organization_url !== "" && this.state.organization_name !== ""){
        contactmessage = "Contact <a href="+this.state.organization_url+">"+this.state.organization_name+"</a> to get access";
      }else if (this.state.organization_name !== ""){
        contactmessage = "Contact "+this.state.organization_name+" to get access";
      }
      return (
        <div className = "body-container-banner">
          <div className = "page-container centralize logged-out">
            <br/>
            <h2>Interested to join us?</h2>
            <br/><br/>
            {this.state.newuseremail} is currently not associated with an account.
            <br/>{contactmessage}
            <br/>
            <br/>
              <Button href={WOOLAROO_URL} variant="outlined" color="secondary">
               Back to Woolaroo
              </Button>

              <Button variant="contained"
                color="primary"
                onClick={() => this.authAction_()}
              >
               Try again
              </Button>

          </div>
        </div>
      );
    } else if (!this.state.email) {
      return (
        <div className = "body-container-banner">
          <div className = "page-container centralize logged-out">
            <img
              src={LANDING_IMG}
              alt=""
              className="landing-page-img"
            />
            <br/><br/><br />
            <div className="textblock">Woolaroo is an open-source Google platform that helps indigenous language organizations build their own photo-translation web-apps
            </div><br/>
            <Button
              onClick={() => this.authAction_()}
            >
              <img src={SIGNIN_ASSET} alt="Sign in with Google" />
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className="body-container">
        {/* Only renders the permanent side menu in desktop widths. */}
        <Breakpoint large up>
          {!!this.state.email ? <NavMenu /> : null}
        </Breakpoint>
        <div className="body-margin" />
        <div className="page-container">
          <Route path={ROUTES.ADD_WORDS} component={AddWordsPage} />
          <Route exact path={[ROUTES.TRANSLATIONS, "/translations/:pageNum"]} component={TranslationsPageWithRouter} />
          <Route path={ROUTES.CONTRIBUTIONS} component={ContributionsPage} />
          <Route path={ROUTES.SHARING} component={SharingPage} />
          <Route path={ROUTES.MANAGEMENT} component={ManagementPage} />
        </div>
        <div className="body-margin" />
      </div>
    );
  }

  render() {
    return (
      <Router>
        <BreakpointProvider>
          <div className="app-container">
            <Header
              woolarooURL={WOOLAROO_URL}
              logoURL={WOOLAROO_IMG}
              signedIn={!!this.state.email}
              authInitializing={this.state.authInitializing}
              authAction={() => this.authAction_()}
            />
            {this.renderBody()}
          </div>
        </BreakpointProvider>
      </Router>
    );
  }
}

export {
  App,
  ROUTES
};
