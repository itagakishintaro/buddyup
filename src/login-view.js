import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';

class LoginView extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
      .google {
          padding: 0.5em 1em;
          margin: 1em 5em 1em 1em;
          background-color: #DD4B39;
          border: none;
          color: #FFF;
          cursor: pointer;
          width: calc(100% - 2em) ;
      }
      .or {
        margin: 1em 0;
        text-align: center;
      }
      .on {
        float: right;
      }

      </style>
      <div class="container">
        <div id="error" class="error"></div>
        <div class="clearfix">
          <paper-input id="email" type="email" always-float-label label="email"></paper-input>
          <paper-input id="password" type="password" always-float-label label="password"></paper-input>
          <paper-button raised class="on" on-click="login">ログイン</paper-button>
        </div>
        <div class="or">または</div>
        <button class="google" on-click="googleLogin">Googleでログイン</button>
        <hr>
        <div class="or">はじめての方</div>
        <div class="clearfix">
          <paper-input id="signupEmail" type="email" always-float-label label="email"></paper-input>
          <paper-input id="signupPassword" type="password" always-float-label label="password"></paper-input>
          <paper-button raised class="on" on-click="signup">ユーザー登録</paper-button>
        </div>
      </div>

    `;
    }

    static get properties() {
        return {
            user: Object
        }
    }

    // authentication
    signup() {
      this.$.error.textContent = "";
      let email = this.$.signupEmail.value;
      let password = this.$.signupPassword.value;
      this.$.signupEmail.value = "";
      this.$.signupPassword.value = "";
      firebase.auth().createUserWithEmailAndPassword(email, password).catch( error => {
        this.$.error.textContent = error.message;
        console.error(error.code, error.message);
      });
    }

    login(){
      this.$.error.textContent = "";
      let email = this.$.email.value;
      let password = this.$.password.value;
      this.$.email.value = "";
      this.$.password.value = "";
      firebase.auth().signInWithEmailAndPassword(email, password).catch( error => {
        this.$.error.textContent = error.message;
        console.error(error.code, error.message);
      });
    }

    googleLogin() {
        let provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect( provider );
    }

}

window.customElements.define( 'login-view', LoginView );
