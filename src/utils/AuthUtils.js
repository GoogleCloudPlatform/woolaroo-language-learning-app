import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig_ = _CONFIG_PLACEHOLDER_;

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
