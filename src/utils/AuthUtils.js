import firebase from 'firebase/app';
import 'firebase/auth';

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

const firebaseConfig_ = IS_LOCAL ? localFirebaseConfig_ : _CONFIG_PLACEHOLDER_; // eslint-disable-line

class AuthUtils {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig_);
    }

    this.provider_ = new firebase.auth.GoogleAuthProvider();
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
