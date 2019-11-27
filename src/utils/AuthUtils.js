import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const IS_LOCAL = process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'test';

const localFirebaseConfig_ = {
  apiKey: "AIzaSyAdh6AhIjdLezKR0SH3x6vzbMh1_benKk8",
  authDomain: "barnard-project.firebaseapp.com",
  databaseURL: "https://barnard-project.firebaseio.com",
  projectId: "barnard-project",
  storageBucket: "barnard-project.appspot.com",
  messagingSenderId: "929114075380",
  appId: "1:929114075380:web:3ab89bf036919331262ea1",
  measurementId: "G-4X4KQ1ZF68"
};

const config = require('../config.json');

const firebaseConfig_ = IS_LOCAL ? localFirebaseConfig_ : config.firebase_config; // eslint-disable-line

class AuthUtils {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig_);
      AuthUtils.fsdb = firebase.firestore();
      AuthUtils.app_url = "https://"+firebaseConfig_.projectId+".appspot.com";
      AuthUtils.app_url_contributor = "https://"+firebaseConfig_.projectId+".firebaseapp.com";
    }
    // to be overwritten by firestore values
    AuthUtils.app_settings = {
      organization_name: "",
      organization_url: "",
      primary_language: "",
      privacy_policy: "",
      translation_language: ""
    }
    this.provider_ = new firebase.auth.GoogleAuthProvider();
  }

  static setAppSettings(app_settings){
    AuthUtils.app_settings = app_settings;
  }
  static getAppSettings(){
    const appSettings = AuthUtils.getAppSettings();
    if (appSettings.primary_language && appSettings.organization_url && appSettings.organization_name){
        return AuthUtils.app_settings;
    }else{
        return null;
    }
  }
  static getPrimaryLanguage(){
    return AuthUtils.app_settings.primary_language;
  }
  async signInWithPopup() {
    return await firebase.auth().signInWithPopup(this.provider_);
  }

  static async signOut() {
    return await firebase.auth().signOut();
  }

  static getUser() {
    return AuthUtils.user;
  }

  static setUser(user) {
    AuthUtils.user = user;
  }
  static getUserType(user) {
    return AuthUtils.usertype;
  }
  static setUserType(user) {
    AuthUtils.usertype = user;
  }

  static async getAuthHeader() {
    if (!AuthUtils.user) {
      return 'Bearer ';
    }

    if (AuthUtils.idToken) {
      return `Bearer ${AuthUtils.idToken}`;
    }

    const idToken = await AuthUtils.user.getIdToken();
    AuthUtils.idToken = idToken;

    return `Bearer ${idToken}`;
  }

  getFirebaseAuth() {
    return firebase.auth();
  }
}


export default AuthUtils;
