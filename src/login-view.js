import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class LoginView extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
      .login {
          padding: 0.5em 1em;
          margin: 1em 5em 1em 1em;
          background-color: #DD4B39;
          border: none;
          color: #FFF;
          cursor: pointer;
          width: calc(100% - 2em) ;
      }

      </style>
      <button class="login" on-click="login">Googleでログイン</button>

    `;
    }

    static get properties() {
        return {
            user: Object
        }
    }

    // login
    login() {
        console.log( 'login()' );
        let provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect( provider );
    }

}

window.customElements.define( 'login-view', LoginView );
